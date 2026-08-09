package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"sync"
	"syscall"
	"time"

	"github.com/golang-jwt/jwt/v5"
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
	jwtSecret   = []byte("kinvite-super-secure-production-key-change-me")
	seatingMap  = []GuestNode{
		{Name: "Mom", Relation: "Family", Status: "confirmed", Links: []string{"Dad", "Sister"}},
		{Name: "Dad", Relation: "Family", Status: "confirmed", Links: []string{"Mom", "Sister"}},
		{Name: "Sister", Relation: "Family", Status: "pending", Links: []string{"Mom", "Dad"}},
		{Name: "Aryan", Relation: "Friend", Status: "confirmed", Links: []string{"Priya", "Leo"}},
		{Name: "Priya", Relation: "Friend", Status: "pending", Links: []string{"Aryan", "Leo"}},
		{Name: "Tom", Relation: "Colleague", Status: "confirmed", Links: []string{"Rahul", "Sara"}},
	}
	seatingMutex sync.Mutex

	// In-memory fallback rate limiter for high-availability
	localRateLimits = make(map[string][]time.Time)
	localMutex      sync.Mutex
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
		PoolSize:     100, // Large pool to handle massive concurrent requests
	})

	// Load production JWT secret if configured
	secretEnv := os.Getenv("JWT_SECRET")
	if secretEnv != "" {
		jwtSecret = []byte(secretEnv)
	}
}

func main() {
	initRedis()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()

	// Register API endpoints
	mux.HandleFunc("GET /api/health", handleHealth)
	mux.HandleFunc("GET /api/seating", handleGetSeating)
	mux.HandleFunc("POST /api/seating", handlePostSeating)
	mux.HandleFunc("POST /api/reminders", handlePostReminder)

	// Chain secure middlewares: Rate Limit -> JWT Authentication -> CORS / Headers
	securedHandler := rateLimitMiddleware(jwtMiddleware(corsMiddleware(mux)))

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      securedHandler,
		ReadTimeout:  5 * time.Second,   // Protect against Slowloris attacks
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	// Capture termination signals
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	go func() {
		log.Printf("Starting hybrid Go gateway on port %s...", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed to bind: %v", err)
		}
	}()

	<-stop
	log.Println("Shutting down Go gateway server gracefully...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Graceful server shutdown failed: %v", err)
	}

	redisMutex.Lock()
	if redisClient != nil {
		redisClient.Close()
		log.Println("Closed connection pool to Redis.")
	}
	redisMutex.Unlock()

	log.Println("Go gateway server exited.")
}

// 1. Rate Limiting Middleware (Redis sliding-window with fallback)
func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip, _, err := net.SplitHostPort(r.RemoteAddr)
		if err != nil {
			ip = r.RemoteAddr
		}

		limit := 120 // Max requests per minute
		window := 60 * time.Second

		if isRateLimited(ip, limit, window) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			json.NewEncoder(w).Encode(map[string]string{
				"error": "Too many requests. Please slow down.",
			})
			return
		}
		next.ServeHTTP(w, r)
	})
}

func isRateLimited(ip string, limit int, window time.Duration) bool {
	redisMutex.RLock()
	client := redisClient
	redisMutex.RUnlock()

	if client == nil {
		return isRateLimitedFallback(ip, limit, window)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 500*time.Millisecond)
	defer cancel()

	key := fmt.Sprintf("rate:%s", ip)
	now := time.Now().UnixNano()
	clearBefore := time.Now().Add(-window).UnixNano()

	// Sliding window transaction pipeline using Redis ZSET
	pipe := client.TxPipeline()
	pipe.ZRemRangeByScore(ctx, key, "0", fmt.Sprintf("%d", clearBefore))
	pipe.ZAdd(ctx, key, redis.Z{Score: float64(now), Member: fmt.Sprintf("%d", now)})
	pipe.ZCard(ctx, key)
	pipe.Expire(ctx, key, window)

	cmds, err := pipe.Exec(ctx)
	if err != nil {
		log.Printf("Redis rate limit check failed: %v, falling back to local memory.", err)
		return isRateLimitedFallback(ip, limit, window)
	}

	cardCmd, ok := cmds[2].(*redis.IntCmd)
	if !ok {
		return false
	}

	count, _ := cardCmd.Result()
	return int(count) > limit
}

func isRateLimitedFallback(ip string, limit int, window time.Duration) bool {
	localMutex.Lock()
	defer localMutex.Unlock()

	now := time.Now()
	cutoff := now.Add(-window)

	// Filter out old timestamps
	timestamps := localRateLimits[ip]
	valid := []time.Time{}
	for _, t := range timestamps {
		if t.After(cutoff) {
			valid = append(valid, t)
		}
	}

	if len(valid) >= limit {
		localRateLimits[ip] = valid
		return true
	}

	valid = append(valid, now)
	localRateLimits[ip] = valid
	return false
}

// 2. JWT Authentication Middleware
func jwtMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Bypass JWT check for health status endpoint
		if r.URL.Path == "/api/health" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Authorization token is missing or malformed"})
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid or expired authorization token"})
			return
		}

		next.ServeHTTP(w, r)
	})
}

// 3. CORS and Security Headers Middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Secure CORS controls
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// OWASP Production Security Headers
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

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

	if client == nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]string{"error": "Queue broker service is offline"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if err := client.LPush(ctx, "reminders_queue", taskPayload).Err(); err != nil {
		log.Printf("Redis LPUSH failed: %v", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Failed to enqueue task payload. Redis connection issue.",
		})
		return
	}

	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "queued",
		"guest":  req.Guest,
	})
}
