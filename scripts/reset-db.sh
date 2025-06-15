#!/bin/bash

# Medispa Dashboard - Database Reset Script
# This script resets the database and optionally seeds it with sample data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔄 Resetting Medispa Dashboard Database...${NC}"

# Function to use docker compose or docker-compose
docker_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        docker-compose "$@"
    else
        docker compose "$@"
    fi
}

# Check if containers are running
if ! docker_compose ps | grep -q "medispa-postgres.*Up"; then
    echo -e "${RED}❌ PostgreSQL container is not running. Please start the development environment first.${NC}"
    echo "Run: ./scripts/start-dev.sh"
    exit 1
fi

echo -e "${YELLOW}⚠️  This will completely reset your database and remove all data!${NC}"
echo "Are you sure you want to continue? (y/N)"
read -r response

if [[ ! "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}🚫 Operation cancelled.${NC}"
    exit 0
fi

echo -e "${YELLOW}🗑️  Dropping existing database...${NC}"
docker_compose exec postgres psql -U medispa -d postgres -c "DROP DATABASE IF EXISTS medispa_dashboard;"

echo -e "${BLUE}🏗️  Creating new database...${NC}"
docker_compose exec postgres psql -U medispa -d postgres -c "CREATE DATABASE medispa_dashboard;"

echo -e "${BLUE}📊 Running Prisma migrations...${NC}"
docker_compose exec app npx prisma db push --force-reset

echo -e "${BLUE}🔧 Generating Prisma client...${NC}"
docker_compose exec app npx prisma generate

# Ask if user wants to seed the database
echo ""
echo -e "${YELLOW}🌱 Would you like to seed the database with sample data? (y/N)${NC}"
read -r seed_response

if [[ "$seed_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    if [ -f "prisma/seed.ts" ]; then
        echo -e "${BLUE}🌱 Seeding database with sample data...${NC}"
        docker_compose exec app pnpm db:seed
        echo -e "${GREEN}✅ Database seeded successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  No seed file found (prisma/seed.ts). Skipping seeding.${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Database reset completed successfully!${NC}"
echo -e "${BLUE}📝 Next steps:${NC}"
echo "  1. Your application should automatically reconnect"
echo "  2. Check the logs: docker-compose logs app"
echo "  3. Visit: http://localhost:3000"
echo ""
echo -e "${YELLOW}💡 Pro tip: You can also use Prisma Studio to inspect your database:${NC}"
echo "   docker-compose --profile tools up prisma-studio"
echo "   Then visit: http://localhost:5555"
