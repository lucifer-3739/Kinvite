import json
from main import process_task

def test_process_task_valid():
    payload = {
        "task": "send_reminder",
        "guest": "Grandma",
        "phone": "+1999999999",
        "message": "We hope to see you at the banquet!"
    }
    payload_str = json.dumps(payload)
    assert process_task(payload_str) is True

def test_process_task_missing_fields():
    payload = {
        "task": "send_reminder",
        "guest": "Grandma"
    }
    payload_str = json.dumps(payload)
    assert process_task(payload_str) is False

def test_process_task_invalid_json():
    assert process_task("{invalid_json_string}") is False
