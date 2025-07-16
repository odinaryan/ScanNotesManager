#!/bin/bash

echo "🚀 Starting Scan Notes Manager Development Environment"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start services
echo "🔧 Building and starting services..."
docker compose up --build

echo "✅ Development environment started!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo "Direct Backend: http://localhost:8080" 