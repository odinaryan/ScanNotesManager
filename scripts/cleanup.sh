#!/bin/bash

echo "🧹 Cleaning up Scan Notes Manager Development Environment"
echo "========================================================="

# Stop and remove containers
echo "🛑 Stopping services..."
docker-compose down

# Remove volumes
echo "🗑️  Removing volumes..."
docker-compose down -v

# Remove images (optional)
read -p "Do you want to remove Docker images? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️  Removing Docker images..."
    docker-compose down --rmi all
fi

# Clean up dangling images and containers
echo "🧹 Cleaning up Docker system..."
docker system prune -f

echo "✅ Cleanup completed!" 