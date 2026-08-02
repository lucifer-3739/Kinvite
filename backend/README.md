# Kinvite Production Hybrid Backend

This is Kinvite's hybrid backend consisting of a high-performance **Go API Gateway** and an asynchronous **Python Background Worker** communicating via a shared **Redis Task Queue**.

---

## Directory Structure

* `/gateway` (Go 1.22+): HTTP endpoints, seating node map checks, task queue submission.
* `/worker` (Python 3.11+): Asynchronous task processing (SMS, emails, invitations syncing).
* `docker-compose.yml`: Local orchestrator matching production-ready parameters.
* `.env.example`: Env configuration blueprints.

---

## Production API Specification

### 1. Health Check
* **Endpoint**: `GET /api/health`
* **Response**:
  ```json
  {
    "status": "ok",
    "service": "go-gateway"
  }
  ```

### 2. Seating Node Configuration
* **Endpoint**: `GET /api/seating`
* **Response**: Returns current relational guest seating nodes.

* **Endpoint**: `POST /api/seating`
* **Payload**:
  ```json
  {
    "name": "Aryan",
    "relation": "Friend",
    "status": "confirmed",
    "links": ["Priya", "Leo"]
  }
  ```

### 3. Queue Notification Reminder
* **Endpoint**: `POST /api/reminders`
* **Payload**:
  ```json
  {
    "guest": "Mom",
    "phone": "+1234567890",
    "message": "Remember to RSVP!"
  }
  ```
* **Response**:
  ```json
  {
    "status": "queued",
    "guest": "Mom"
  }
  ```

---

## Production Deployment

### Docker Orchestration (Recommended)
Build and spin up the complete backend cluster (Redis, Go Gateway, Python Worker):
```bash
docker compose up -d --build
```

### Manual Configuration
1. Spin up a Redis instance.
2. Configure `.env` variables (copy from `.env.example`).
3. Build and execute the Go API binary:
   ```bash
   cd gateway && go build -o gateway && ./gateway
   ```
4. Install Python worker packages and run:
   ```bash
   cd worker && pip install -r requirements.txt && python main.py
   ```
