package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHandleHealth(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handleHealth)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var body map[string]string
	if err := json.Unmarshal(rr.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}

	if body["status"] != "ok" || body["service"] != "go-gateway" {
		t.Errorf("handler returned unexpected body: got %v", body)
	}
}

func TestHandleGetSeating(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/seating", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handleGetSeating)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var response SeatingResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &response); err != nil {
		t.Fatal(err)
	}

	if len(response.Guests) == 0 {
		t.Errorf("expected seating node guest elements, got empty list")
	}
}

func TestHandlePostSeating(t *testing.T) {
	node := GuestNode{
		Name:     "TestGuest",
		Relation: "Friend",
		Status:   "pending",
		Links:    []string{"Mom"},
	}

	bodyBytes, _ := json.Marshal(node)
	req, err := http.NewRequest("POST", "/api/seating", bytes.NewBuffer(bodyBytes))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handlePostSeating)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}

	var savedNode GuestNode
	if err := json.Unmarshal(rr.Body.Bytes(), &savedNode); err != nil {
		t.Fatal(err)
	}

	if savedNode.Name != "TestGuest" {
		t.Errorf("expected guest name 'TestGuest', got '%s'", savedNode.Name)
	}
}

func TestHandlePostReminderValidation(t *testing.T) {
	// Request missing required fields
	reqBody := map[string]string{
		"guest": "Uncle",
	}

	bodyBytes, _ := json.Marshal(reqBody)
	req, err := http.NewRequest("POST", "/api/reminders", bytes.NewBuffer(bodyBytes))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(handlePostReminder)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}
