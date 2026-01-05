FROM golang:1.22-alpine
WORKDIR /app
CMD ["sh", "-c", "go build -o /tmp/main main.go && /tmp/main"]
