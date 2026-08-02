# Build Stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy dependency configs
COPY go.mod ./
RUN go mod download

# Copy source code
COPY main.go ./

# Compile Go static binary
RUN CGO_ENABLED=0 GOOS=linux go build -o gateway .

# Final Secure Run Stage
FROM alpine:latest

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/gateway .

EXPOSE 8080

CMD ["./gateway"]
