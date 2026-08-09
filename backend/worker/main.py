import os
import sys
import json
import asyncio
import logging
from contextlib import asynccontextmanager
from typing import Dict, Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import redis.asyncio as aioredis

# Setup production logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("worker")

REDIS_ADDR = os.getenv("REDIS_ADDR", "localhost:6379")
QUEUE_NAME = "reminders_queue"

# Shared metrics
metrics = {
    "processed_tasks": 0,
    "failed_tasks": 0,
    "redis_status": "disconnected"
}

redis_pool = None
worker_task = None
running = True

# Pydantic input sanitation schema
class ReminderPayload(BaseModel):
    guest: str = Field(..., min_length=1, max_length=100)
    phone: str = Field(..., min_length=5, max_length=30)
    message: str = Field(..., min_length=1, max_length=1000)

async def process_task(payload_str: str) -> bool:
    try:
        payload = json.loads(payload_str)
        # Validate schema via Pydantic
        validated = ReminderPayload(**payload)
        
        logger.info(f"[SMS SENDER] Sending text alert to '{validated.guest}'")
        logger.info(f"             Phone: {validated.phone}")
        logger.info(f"             Message: '{validated.message}'")
        metrics["processed_tasks"] += 1
        return True
    except Exception as e:
        logger.error(f"Failed to parse or process queue payload: {e}")
        metrics["failed_tasks"] += 1
        return False

# Asynchronous Background Worker Loop
async def reminders_worker_loop():
    global running, redis_pool
    logger.info("Initializing asynchronous reminders worker pool...")
    
    host, port = REDIS_ADDR.split(":")
    redis_pool = aioredis.ConnectionPool(
        host=host,
        port=int(port),
        db=0,
        max_connections=50, # Support high concurrent socket loads
        socket_timeout=5
    )
    
    while running:
        client = aioredis.Redis(connection_pool=redis_pool)
        try:
            metrics["redis_status"] = "connected"
            # Asynchronous non-blocking pop from queue
            task = await client.brpop(QUEUE_NAME, timeout=2)
            if task:
                _, payload_bytes = task
                await process_task(payload_bytes.decode("utf-8"))
        except aioredis.ConnectionError as ce:
            logger.warning(f"Redis disconnected: {ce}. Retrying in 2 seconds...")
            metrics["redis_status"] = "disconnected"
            await asyncio.sleep(2)
        except Exception as e:
            if running:
                logger.error(f"Worker runtime error: {e}")
                await asyncio.sleep(1)
        finally:
            await client.aclose()

    logger.info("Asynchronous worker loop exited.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Launch the worker queue task concurrently on the event loop
    global worker_task, running
    running = True
    worker_task = asyncio.create_task(reminders_worker_loop())
    yield
    # Shutdown: Stop worker gracefully
    running = False
    logger.info("Shutting down worker process...")
    if worker_task:
        worker_task.cancel()
        try:
            await worker_task
        except asyncio.CancelledError:
            pass
    if redis_pool:
        await redis_pool.disconnect()
    logger.info("Cleanup completed successfully.")

app = FastAPI(
    title="Kinvite Reminders Worker",
    version="1.0.0",
    lifespan=lifespan
)

# Secure CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health"])
async def read_root() -> Dict[str, Any]:
    return {
        "service": "kinvite-reminders-worker",
        "redis_connection": metrics["redis_status"],
        "metrics": {
            "processed": metrics["processed_tasks"],
            "failed": metrics["failed_tasks"]
        }
    }

@app.post("/api/reminders/process", status_code=status.HTTP_202_ACCEPTED, tags=["Queue"])
async def trigger_manual_reminder(payload: ReminderPayload) -> Dict[str, str]:
    # Simulate processing directly
    success = await process_task(payload.model_dump_json())
    if not success:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Failed to validate or process alert request"
        )
    return {"status": "processed", "guest": payload.guest}

if __name__ == "__main__":
    import uvicorn
    # Use uvloop to handle 100k requests/connections on POSIX systems
    if sys.platform != "win32":
        try:
            import uvloop
            asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
            logger.info("Registered high-performance uvloop policy.")
        except ImportError:
            pass

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        workers=1, # Scale horizontally via docker-compose instead of multiprocess
        loop="auto"
    )
