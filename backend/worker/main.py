import os
import sys
import json
import time
import redis

# Redis Configuration
REDIS_ADDR = os.getenv("REDIS_ADDR", "localhost:6379")
QUEUE_NAME = "reminders_queue"

def get_redis_client():
    host, port = REDIS_ADDR.split(":")
    return redis.Redis(host=host, port=int(port), db=0, socket_timeout=2)

def process_task(payload_str):
    try:
        payload = json.loads(payload_str)
        task = payload.get("task")
        guest = payload.get("guest")
        phone = payload.get("phone")
        message = payload.get("message")
        
        if not all([task, guest, phone, message]):
            print(f"[Worker Error] Missing required fields in task payload: {payload}", flush=True)
            return False
            
        print(f"[SMS SENDER] Successfully sent text reminder alert to guest '{guest}'", flush=True)
        print(f"             Phone number: {phone}", flush=True)
        print(f"             Message: '{message}'", flush=True)
        return True
    except Exception as e:
        print(f"[Worker Error] Failed to process queue task payload: {e}", flush=True)
        return False

def start_worker(dry_run=False):
    print(f"Starting hybrid Python worker listening on Redis queue '{QUEUE_NAME}'...", flush=True)
    
    try:
        client = get_redis_client()
        # Test connection
        client.ping()
        print("Connected to Redis successfully.", flush=True)
    except Exception as e:
        print(f"Warning: Failed to connect to Redis: {e}. Running in sandbox offline fallback mode.", flush=True)
        if dry_run:
            return

    if dry_run:
        print("Dry run completed successfully.", flush=True)
        return

    while True:
        try:
            # Blocking pop from the queue
            task = client.brpop(QUEUE_NAME, timeout=5)
            if task:
                _, payload_str = task
                process_task(payload_str.decode("utf-8"))
        except redis.ConnectionError:
            time.sleep(2)
        except KeyboardInterrupt:
            print("Stopping Python background worker...", flush=True)
            break
        except Exception as e:
            print(f"Worker runtime loop error: {e}", flush=True)
            time.sleep(1)

if __name__ == "__main__":
    is_dry = "--dry-run" in sys.argv
    start_worker(dry_run=is_dry)
