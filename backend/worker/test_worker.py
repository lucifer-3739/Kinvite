from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["service"] == "kinvite-reminders-worker"
    assert "metrics" in data

def test_trigger_manual_reminder_valid():
    payload = {
        "guest": "Grandma",
        "phone": "+1999999999",
        "message": "We hope to see you at the banquet!"
    }
    response = client.post("/api/reminders/process", json=payload)
    assert response.status_code == 202
    data = response.json()
    assert data["status"] == "processed"
    assert data["guest"] == "Grandma"

def test_trigger_manual_reminder_invalid_phone():
    payload = {
        "guest": "Grandma",
        "phone": "12", # too short (Pydantic validation should block)
        "message": "Valid message"
    }
    response = client.post("/api/reminders/process", json=payload)
    assert response.status_code == 422 # Unprocessable Entity

def test_trigger_manual_reminder_missing_fields():
    payload = {
        "guest": "Grandma"
    }
    response = client.post("/api/reminders/process", json=payload)
    assert response.status_code == 422
