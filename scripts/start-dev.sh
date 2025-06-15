#!/bin/bash

# Medispa Dashboard - Docker Development Startup Script
# This script starts the complete development environment with Docker Compose

set -e

echo "🚀 Starting Medispa Dashboard Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose >/dev/null 2>&1 && ! docker compose version >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker Compose is not available. Please install Docker Compose.${NC}"
    exit 1
fi

# Function to use docker compose or docker-compose
docker_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

echo -e "${BLUE}📋 Development Environment Setup:${NC}"
echo "  • PostgreSQL Database: localhost:5432"
echo "  • Next.js Application: http://localhost:3000"
echo "  • Redis Cache: localhost:6379"
echo "  • Prisma Studio: http://localhost:5555 (optional)"
echo ""

# Check if .env.local exists, if not suggest copying from .env.docker
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  No .env.local file found.${NC}"
    echo "Would you like to copy from .env.docker? (y/n)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cp .env.docker .env.local
        echo -e "${GREEN}✅ Copied .env.docker to .env.local${NC}"
        echo -e "${YELLOW}💡 Please review and update .env.local with your specific configuration.${NC}"
    fi
fi

# Stop any existing containers
echo -e "${YELLOW}🧹 Cleaning up existing containers...${NC}"
docker_compose down --remove-orphans

# Build and start services
echo -e "${BLUE}🔨 Building and starting services...${NC}"
docker_compose up --build -d postgres redis

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
timeout=60
counter=0
while ! docker_compose exec -T postgres pg_isready -U medispa -d medispa_dashboard >/dev/null 2>&1; do
    sleep 2
    counter=$((counter + 2))
    if [ $counter -ge $timeout ]; then
        echo -e "${RED}❌ Database failed to start within $timeout seconds${NC}"
        docker_compose logs postgres
        exit 1
    fi
    echo -n "."
done
echo ""

# Start the application
echo -e "${BLUE}🚀 Starting Next.js application...${NC}"
docker_compose up --build app

# Optional: Start Prisma Studio
echo ""
echo -e "${YELLOW}💡 To start Prisma Studio (database GUI), run:${NC}"
echo "   docker-compose --profile tools up prisma-studio"
echo ""
echo -e "${GREEN}🎉 Development environment is ready!${NC}"
echo "   • Application: http://localhost:3000"
echo "   • Database: localhost:5432"
echo "   • Redis: localhost:6379"
