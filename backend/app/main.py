import os
import lancedb
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import asyncio

# Import local services
from app.services.pdf import pdf_service
from app.services.brain import brain_service
from app.services.voice import voice_service

from app.api.endpoints import router as api_router
from app.routers.proctor import router as proctor_router

from app.db.session import engine, Base
from app.scripts.seed_admin import seed_admin
from app.scripts.seed_admin import seed_admin
from app.scripts.pull_models import pull_models
from app.scripts.download_voice_models import main as download_voice_models

app = FastAPI(title="SmartHire Backend", version="2.0.0")

@app.on_event("startup")
async def startup_event():
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully")
    
    # Seed admin
    await seed_admin()

    # Pull Ollama models (non-blocking)
    asyncio.create_task(asyncio.to_thread(pull_models))

    # Download Voice Models (blocking - needed for startup if missing)
    asyncio.create_task(asyncio.to_thread(download_voice_models))

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include central API router
app.include_router(api_router, prefix="/api")
app.include_router(proctor_router, prefix="/api")

# Initialize LanceDB
DB_PATH = "./lancedb_data"
if not os.path.exists(DB_PATH):
    os.makedirs(DB_PATH)
db = lancedb.connect(DB_PATH)

# Models
class ChatRequest(BaseModel):
    history: List[dict]
    user_input: str

class SpeakRequest(BaseModel):
    text: str
    voice: Optional[str] = "af_heart"

@app.get("/")
async def root():
    return {"status": "online", "engine": "Ollama + LanceDB"}

@app.post("/api/analyze")
async def analyze_candidate(file: UploadFile = File(...), job_description: str = Form(...)):
    """
    Endpoint for uploading a resume and getting an AI analysis.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # 1. Read file bytes
        content = await file.read()
        
        # 2. Parse PDF to Markdown using Docling
        markdown_text = pdf_service.parse_resume(content)
        
        # 3. Analyze with Phi-3.5
        analysis = brain_service.analyze_resume(markdown_text, job_description)
        
        # 4. Generate Embedding and Upsert to LanceDB
        vector = brain_service.embed_text(markdown_text)
        table_name = "candidates"
        if table_name not in db.table_names():
            db.create_table(table_name, data=[{"vector": vector, "text": markdown_text, "briefing": analysis["candidate_briefing"]}])
        else:
            table = db.open_table(table_name)
            table.add([{"vector": vector, "text": markdown_text, "briefing": analysis["candidate_briefing"]}])
        
        return {
            "filename": file.filename,
            "markdown": markdown_text,
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/feed/recommend")
async def recommend_jobs(query: str, limit: int = 10):
    """
    Hybrid search for jobs based on a natural language query.
    """
    try:
        query_vector = brain_service.embed_text(query)
        table_name = "jobs"
        
        if table_name not in db.table_names():
            return {"results": []}
            
        table = db.open_table(table_name)
        # LanceDB Vector Search
        results = table.search(query_vector).limit(limit).to_list()
        
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/chat")
async def interview_chat(request: ChatRequest):
    """
    Endpoint for interacting with Aria.
    """
    reply = brain_service.chat_with_aria(request.history, request.user_input)
    return {"reply": reply}

@app.post("/api/interview/speak")
async def interview_speak(request: SpeakRequest):
    """
    Endpoint for text-to-speech.
    """
    audio_data = voice_service.speak(request.text, voice=request.voice)
    if not audio_data:
        raise HTTPException(status_code=500, detail="Failed to generate audio")
    
    return Response(content=audio_data, media_type="audio/wav")

@app.websocket("/api/interview/ws")
async def interview_websocket(websocket: WebSocket):
    """
    WebSocket for real-time audio interaction.
    Flow: User Audio Blob -> Moonshine (STT) -> Llama (Reply) -> Kokoro (TTS) -> AI Audio Blob
    """
    await websocket.accept()
    try:
        while True:
            # Receive audio blob
            data = await websocket.receive_bytes()
            
            # 1. Listen (STT)
            text = voice_service.listen(data)
            
            if text:
                # 2. Chat (Brain)
                # Note: In a real app, you'd manage session history properly
                reply = brain_service.chat_with_aria([], text)
                
                # 3. Speak (TTS)
                audio_reply = voice_service.speak(reply)
                
                # 4. Send back audio
                await websocket.send_bytes(audio_reply)
                
    except WebSocketDisconnect:
        print("Interview WebSocket disconnected")
    except Exception as e:
        print(f"WS Error: {e}")
        await websocket.close()

@app.post("/api/profiles/ingest")
async def ingest_profile(profile_data: dict):
    """
    Ingest structured profile data into LanceDB.
    """
    try:
        # Generate vector from bio/experience
        text_for_embedding = f"{profile_data.get('name')} {profile_data.get('bio')} {profile_data.get('skills')}"
        vector = brain_service.embed_text(text_for_embedding)
        
        table_name = "profiles"
        if table_name not in db.table_names():
            db.create_table(table_name, data=[{"vector": vector, "data": profile_data}])
        else:
            table = db.open_table(table_name)
            table.add([{"vector": vector, "data": profile_data}])
            
        return {"status": "success", "profile_id": profile_data.get('id')}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
