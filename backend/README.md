# SmartHire Backend

High-performance FastAPI backend with "Power Stack" architecture.

## Tech Stack
- **Framework**: FastAPI
- **Database**: PostgreSQL + AsyncPG
- **Caching**: Redis
- **Tasks**: Celery
- **AI**: PyTorch / Transformers

## Setup

### Option 1: Docker (Recommended)
Run the entire stack (DB, Redis, API, Worker) with one command:
```bash
docker-compose up --build
```

### Option 2: Local Development
1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start Services (Ensure Postgres & Redis are running locally).
3. Run API:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Run Worker:
   ```bash
   celery -A app.workers.celery_app worker --loglevel=info
   ```

## API Documentation
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
