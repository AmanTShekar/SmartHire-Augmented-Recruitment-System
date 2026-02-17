from fastapi import APIRouter, WebSocket, UploadFile, File, Form, HTTPException
import os
import json
import base64
import cv2
import numpy as np
import logging
from typing import Dict, Any, List
from app.services.sentinel_identity import sentinel_identity, UPLOAD_DIR
from app.services.sentinel_loop import sentinel_loop

router = APIRouter(prefix="/proctor", tags=["proctor"])
logger = logging.getLogger(__name__)

@router.post("/verify-profile")
async def verify_profile(
    session_id: str = Form(...),
    profile_photo: UploadFile = File(...)
):
    """Uploads a high-quality reference portrait of the candidate."""
    if session_id not in sentinel_identity.active_verification_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    file_path = os.path.join(UPLOAD_DIR, f"{session_id}_profile.jpg")
    with open(file_path, "wb") as f:
        f.write(await profile_photo.read())
        
    sentinel_identity.active_verification_sessions[session_id]["profile_photo_path"] = file_path
    return {"status": "success", "message": "Profile photo uploaded"}

@router.post("/verify-id")
async def verify_id(
    session_id: str = Form(...),
    id_card: UploadFile = File(...)
):
    """Uploads ID card and associates it with the session."""
    if session_id not in sentinel_identity.active_verification_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    file_path = os.path.join(UPLOAD_DIR, f"{session_id}_id.jpg")
    with open(file_path, "wb") as f:
        f.write(await id_card.read())
        
    sentinel_identity.active_verification_sessions[session_id]["id_card_path"] = file_path
    return {"status": "success", "message": "ID card uploaded"}

@router.post("/handshake")
async def initiate_handshake(candidate_id: str = Form(...), session_id: str = Form(...)):
    """Initializes a new verification session."""
    return sentinel_identity.initiate_handshake(candidate_id, session_id)

@router.websocket("/ws/sentinel")
async def sentinel_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            msg = json.loads(data)
            
            msg_type = msg.get("type")
            session_id = msg.get("session_id")
            
            if not msg.get("frame"):
                continue

            # Decode base64 frame
            try:
                header, encoded = msg["frame"].split(",", 1)
                img_data = base64.b64decode(encoded)
                nparr = np.frombuffer(img_data, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            except Exception as e:
                logger.error(f"Frame decoding failed: {e}")
                continue

            if msg_type == "handshake_frame":
                # Multi-angle liveness handshake
                result = await sentinel_identity.verify_handshake(session_id, frame)
                await websocket.send_json({
                    "type": "handshake_result",
                    "data": result
                })
            
            elif msg_type == "proctor_frame":
                # Real-time interview proctoring
                response = sentinel_loop.process_frame(session_id, frame)
                await websocket.send_json({
                    "type": "proctor_update",
                    "data": response
                })

    except Exception as e:
        logger.error(f"WebSocket error: {e}")
    finally:
        await websocket.close()
