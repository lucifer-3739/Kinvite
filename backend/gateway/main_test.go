package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// Helper to sign a test token
func getTestTokenString() string {
	claims := jwt.MapClaims{
		"sub": "user-123",
		"exp": time.Now().Add(time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, _ := token.SignedString(jwtSecret)
	return tokenStr
}

func TestHandleHealth(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	// Chain middlewares for testing
	handler := rateLimitMiddleware(jwtMiddleware(corsMiddleware(http.HandlerFunc(handleHealth))))
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

func TestAuthRequiredBlocked(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/seating", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := jwtMiddleware(http.HandlerFunc(handleGetSeating))
	handler.ServeHTTP(rr, req)

	// Requests without token should be blocked with 401
	if status := rr.Code; status != http.StatusUnauthorized {
		t.Errorf("expected status 401 for unauthorized access, got %v", status)
	}
}

func TestAuthAllowedWithToken(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/seating", nil)
	if err != nil {
		t.Fatal(err)
	}

	token := getTestTokenString()
	req.Header.Set("Authorization", "Bearer "+token)

	rr := httptest.NewRecorder()
	handler := jwtMiddleware(http.HandlerFunc(handleGetSeating))
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("expected status 200 with valid JWT, got %v", status)
	}
}

func TestSecurityHeaders(t *testing.T) {
	req, err := http.NewRequest("GET", "/api/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := corsMiddleware(http.HandlerFunc(handleHealth))
	handler.ServeHTTP(rr, req)

	headers := rr.Header()
	if headers.Get("X-Content-Type-Options") != "nosniff" {
		t.Errorf("missing nosniff header")
	}
	if headers.Get("X-Frame-Options") != "DENY" {
		t.Errorf("missing frame options header")
	}
}

func TestHandlePostSeatingWithAuth(t *testing.T) {
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

	token := getTestTokenString()
	req.Header.Set("Authorization", "Bearer "+token)

	rr := httptest.NewRecorder()
	handler := jwtMiddleware(http.HandlerFunc(handlePostSeating))
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusCreated {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusCreated)
	}
}
