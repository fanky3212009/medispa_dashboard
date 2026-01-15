# 🐳 Docker Development Environment

This guide explains how to use Docker for local development of the Medispa Dashboard application.

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- [Git](https://git-scm.com/downloads) (for cloning the repository)
- At least 4GB of available RAM for containers

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to the project:**

   ```bash
   git clone <your-repo-url>
   cd medispa_dashboard
   ```

2. **Set up environment variables:**

   ```bash
   # Copy the Docker environment template
   cp .env.docker .env.local

   # Edit .env.local with your specific configuration if needed
   ```

3. **Start the development environment:**

   ```bash
   # On Linux/Mac:
   ./scripts/start-dev.sh

   # On Windows (PowerShell):
   .\scripts\start-dev.ps1

   # Or manually with Docker Compose:
   docker-compose up --build
   ```

4. **Access your application:**
   - **Application**: http://localhost:3000
   - **Database**: localhost:5432 (user: medispa, password: medispa_dev_password)
   - **Redis**: localhost:6379
   - **Prisma Studio**: http://localhost:5555 (optional, see below)

### Option 2: Manual Docker Commands

```bash
# Build the development image
docker build --target development -t medispa-dashboard-dev .

# Run PostgreSQL
docker run -d --name medispa-postgres \
  -e POSTGRES_USER=medispa \
  -e POSTGRES_PASSWORD=medispa_dev_password \
  -e POSTGRES_DB=medispa_dashboard \
  -p 5432:5432 \
  postgres:15-alpine

# Run the application
docker run -d --name medispa-app \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://medispa:medispa_dev_password@host.docker.internal:5432/medispa_dashboard" \
  -v $(pwd):/app \
  medispa-dashboard-dev
```

## 🛠️ Available Services

| Service           | Description      | URL/Port              | Credentials                                                                |
| ----------------- | ---------------- | --------------------- | -------------------------------------------------------------------------- |
| **Next.js App**   | Main application | http://localhost:3000 | -                                                                          |
| **PostgreSQL**    | Database         | localhost:5432        | user: `medispa`<br>pass: `medispa_dev_password`<br>db: `medispa_dashboard` |
| **Redis**         | Cache/Sessions   | localhost:6379        | No auth                                                                    |
| **Prisma Studio** | Database GUI     | http://localhost:5555 | -                                                                          |

## 📝 Common Commands

### Starting Services

```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Start specific services
docker-compose up postgres redis

# Start with rebuild
docker-compose up --build
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Stop specific service
docker-compose stop app
```

### Database Operations

```bash
# Reset database (Linux/Mac)
./scripts/reset-db.sh

# Reset database (Windows PowerShell)
.\scripts\reset-db.ps1

# Manual database reset
docker-compose exec postgres psql -U medispa -d postgres -c "DROP DATABASE IF EXISTS medispa_dashboard;"
docker-compose exec postgres psql -U medispa -d postgres -c "CREATE DATABASE medispa_dashboard;"
docker-compose exec app npx prisma db push
```

### Prisma Operations

```bash
# Generate Prisma client
docker-compose exec app npx prisma generate

# Push schema changes
docker-compose exec app npx prisma db push

# Run migrations
docker-compose exec app npx prisma migrate dev

# Seed database
docker-compose exec app pnpm db:seed

# Open Prisma Studio
docker-compose --profile tools up prisma-studio
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs app
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f app

# Execute commands in running container
docker-compose exec app bash
docker-compose exec postgres psql -U medispa -d medispa_dashboard
```

## 🔧 Configuration

### Environment Variables

The Docker environment uses the following key variables:

```env
# Database (automatically configured)
DATABASE_URL="postgresql://medispa:medispa_dev_password@postgres:5432/medispa_dashboard"
DIRECT_URL="postgresql://medispa:medispa_dev_password@postgres:5432/medispa_dashboard"

# Authentication
NEXTAUTH_SECRET="your-development-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Optional services
REDIS_URL="redis://redis:6379"
```

### Custom Configuration

1. **Database Settings**: Modify `docker-compose.yml` under the `postgres` service
2. **Application Settings**: Edit environment variables in `docker-compose.yml` under the `app` service
3. **Port Changes**: Update port mappings in `docker-compose.yml`

### Development vs Production

This setup is optimized for **development**. For production deployment:

- Use `Dockerfile.prod` (will be created in Phase 2)
- Use proper secrets management
- Configure reverse proxy (nginx)
- Set up SSL/TLS certificates
- Use managed database services

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**

   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000

   # Stop the service and try again
   docker-compose down
   docker-compose up
   ```

2. **Database connection issues:**

   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres

   # Check PostgreSQL logs
   docker-compose logs postgres

   # Reset database
   ./scripts/reset-db.sh  # Linux/Mac
   .\scripts\reset-db.ps1  # Windows
   ```

3. **Permission issues (Linux/Mac):**

   ```bash
   # Fix script permissions
   chmod +x scripts/*.sh
   ```

4. **Build issues:**

   ```bash
   # Clean rebuild
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

5. **Volume issues:**
   ```bash
   # Remove volumes and start fresh
   docker-compose down -v
   docker volume prune
   docker-compose up --build
   ```

### Health Checks

Check if services are healthy:

```bash
# Application health
curl http://localhost:3000/api/health

# Database health
docker-compose exec postgres pg_isready -U medispa -d medispa_dashboard

# Redis health
docker-compose exec redis redis-cli ping
```

## 🔄 Development Workflow

1. **Start environment**: `docker-compose up -d`
2. **Make code changes**: Files are automatically synced and hot-reloaded
3. **Database changes**: Run `npx prisma db push` in the app container
4. **View changes**: Visit http://localhost:3000
5. **Debug**: Use `docker-compose logs -f app` to see real-time logs
6. **Stop environment**: `docker-compose down`

## 📊 Performance Tips

- **Use volumes**: Source code is mounted as a volume for fast development
- **Persistent data**: Database data persists between container restarts
- **Build cache**: Docker layers are cached for faster rebuilds
- **Resource limits**: Adjust memory limits in `docker-compose.yml` if needed

## 🔒 Security Notes

This setup is for **development only**:

- Database uses simple credentials
- No SSL/TLS encryption
- Debug mode enabled
- All services exposed on localhost

For production, use proper security measures!

## 🆘 Getting Help

- **Check logs**: `docker-compose logs <service>`
- **Inspect containers**: `docker-compose ps`
- **Access container shell**: `docker-compose exec <service> bash`
- **Reset everything**: `docker-compose down -v && docker-compose up --build`

---

Happy coding! 🚀
