package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/redis/go-redis/v9"
)

// Seating Node Models
type GuestNode struct {
	Name     string   `json:"name"`
	Relation string   `json:"relation"`
	Status   string   `json:"status"`
	Links    []string `json:"links"` // Names of related guests
}

type SeatingResponse struct {
	Guests []GuestNode `json:"guests"`
}

type ReminderRequest struct {
	Guest   string `json:"guest"`
	Phone   string `json:"phone"`
	Message string `json:"message"`
}

var (
	redisClient *redis.Client
	redisMutex  sync.RWMutex
	seatingMap  = []GuestNode{
		{Name: "Mom", Relation: "Family", Status: "confirmed", Links: []string{"Dad", "Sister"}},
		{Name: "Dad", Relation: "Family", Status: "confirmed", Links: []string{"Mom", "Sister"}},
		{Name: "Sister", Relation: "Family", Status: "pending", Links: []string{"Mom", "Dad"}},
		{Name: "Aryan", Relation: "Friend", Status: "confirmed", Links: []string{"Priya", "Leo"}},
		{Name: "Priya", Relation: "Friend", Status: "pending", Links: []string{"Aryan", "Leo"}},
		{Name: "Tom", Relation: "Colleague", Status: "confirmed", Links: []string{"Rahul", "Sara"}},
	}
	seatingMutex sync.Mutex
)

func initRedis() {
	redisMutex.Lock()
	defer redisMutex.Unlock()

	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	redisClient = redis.NewClient(&redis.Options{
		Addr:         redisAddr,
		DialTimeout:  2 * time.Second,
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
	})
}

func main() {
	initRedis()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Register handlers using standard library routing
	mux.HandleFunc("GET /api/health", handleHealth)
	mux.HandleFunc("GET /api/seating", handleGetSeating)
	mux.HandleFunc("POST /api/seating", handlePostSeating)
	mux.HandleFunc("POST /api/reminders", handlePostReminder)

	// CORS wrapper
	handler := corsMiddleware(mux)

	server := &http.Server{
		Addr:    ":" + port,
		Handler: handler,
	}

	// Channel to listen for OS signals
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("Starting hybrid Go gateway on port %s...", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server ListenAndServe failed: %v", err)
		}
	}()

	// Wait for termination signal
	<-stop
	log.Println("Shutting down Go gateway server gracefully...")

	// Grace period timeout context
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server forced shutdown error: %v", err)
	}

	// Close Redis connections
	redisMutex.Lock()
	if redisClient != nil {
		if err := redisClient.Close(); err != nil {
			log.Printf("Failed to close Redis connection: %v", err)
		} else {
			log.Println("Redis connection closed successfully.")
		}
	}
	redisMutex.Unlock()

	log.Println("Go gateway server exited.")
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok", "service": "go-gateway"})
}

func handleGetSeating(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	seatingMutex.Lock()
	defer seatingMutex.Unlock()

	json.NewEncoder(w).Encode(SeatingResponse{Guests: seatingMap})
}

func handlePostSeating(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var node GuestNode
	if err := json.NewDecoder(r.Body).Decode(&node); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid guest layout node data"})
		return
	}

	if node.Name == "" || node.Relation == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Name and Relation are required fields"})
		return
	}

	seatingMutex.Lock()
	defer seatingMutex.Unlock()

	// Update or insert guest node
	updated := false
	for i, g := range seatingMap {
		if g.Name == node.Name {
			seatingMap[i] = node
			updated = true
			break
		}
	}
	if !updated {
		seatingMap = append(seatingMap, node)
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(node)
}

func handlePostReminder(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req ReminderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	if req.Guest == "" || req.Phone == "" || req.Message == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Guest, Phone, and Message are required"})
		return
	}

	// Payload message task to push to Redis
	taskPayload, err := json.Marshal(map[string]string{
		"task":    "send_reminder",
		"guest":   req.Guest,
		"phone":   req.Phone,
		"message": req.Message,
	})
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to marshal payload"})
		return
	}

	redisMutex.RLock()
	client := redisClient
	redisMutex.RUnlock()

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// Push to Redis Queue using LPUSH (which Python worker will read using BRPOP)
	if err := client.LPush(ctx, "reminders_queue", taskPayload).Err(); err != nil {
		log.Printf("Redis LPUSH failed: %v", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]string{
			"status": "warning",
			"error":  fmt.Sprintf("Failed to queue task: %v. Running in sandbox offline fallback mode.", err),
		})
		return
	}

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "queued",
		"guest":  req.Guest,
	})
}
