#!/usr/bin/env pwsh

# Medispa Dashboard - Docker Development Startup Script (PowerShell)
# This script starts the complete development environment with Docker Compose

param(
  [switch]$Help,
  [switch]$Clean
)

if ($Help) {
  Write-Host "Medispa Dashboard - Docker Development Startup Script" -ForegroundColor Blue
  Write-Host ""
  Write-Host "Usage: .\scripts\start-dev.ps1 [-Clean] [-Help]" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Options:" -ForegroundColor Green
  Write-Host "  -Clean    Clean up containers and volumes before starting"
  Write-Host "  -Help     Show this help message"
  Write-Host ""
  exit 0
}

Write-Host "🚀 Starting Medispa Dashboard Development Environment..." -ForegroundColor Blue

# Check if Docker is running
try {
  docker info | Out-Null
}
catch {
  Write-Host "❌ Docker is not running. Please start Docker Desktop and try again." -ForegroundColor Red
  exit 1
}

# Check if Docker Compose is available
$dockerComposeCmd = $null
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
  $dockerComposeCmd = "docker-compose"
}
elseif (docker compose version 2>$null) {
  $dockerComposeCmd = "docker compose"
}
else {
  Write-Host "❌ Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
  exit 1
}

Write-Host "📋 Development Environment Setup:" -ForegroundColor Blue
Write-Host "  - PostgreSQL Database: localhost:5432" -ForegroundColor White
Write-Host "  - Next.js Application: http://localhost:3000" -ForegroundColor White
Write-Host "  - Redis Cache: localhost:6379" -ForegroundColor White
Write-Host "  - Prisma Studio: http://localhost:5555 (optional)" -ForegroundColor White
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
  Write-Host "⚠️  No .env.local file found." -ForegroundColor Yellow
  $response = Read-Host "Would you like to copy from .env.docker? (y/N)"
  if ($response -match "^[Yy]") {
    Copy-Item ".env.docker" ".env.local"
    Write-Host "✅ Copied .env.docker to .env.local" -ForegroundColor Green
    Write-Host "💡 Please review and update .env.local with your specific configuration." -ForegroundColor Yellow
  }
}

# Clean up if requested
if ($Clean) {
  Write-Host "🧹 Performing clean startup (removing containers and volumes)..." -ForegroundColor Yellow
  & $dockerComposeCmd down -v --remove-orphans
  docker volume prune -f
}

# Stop any existing containers
Write-Host "🧹 Cleaning up existing containers..." -ForegroundColor Yellow
& $dockerComposeCmd down --remove-orphans

# Build and start services
Write-Host "🔨 Building and starting services..." -ForegroundColor Blue
& $dockerComposeCmd up --build -d postgres redis

# Wait for database to be ready
Write-Host "⏳ Waiting for database to be ready..." -ForegroundColor Yellow
$timeout = 60
$counter = 0
do {
  Start-Sleep -Seconds 2
  $counter += 2
  if ($counter -ge $timeout) {
    Write-Host "❌ Database failed to start within $timeout seconds" -ForegroundColor Red
    & $dockerComposeCmd logs postgres
    exit 1
  }
  Write-Host "." -NoNewline -ForegroundColor Yellow
  $dbReady = & $dockerComposeCmd exec -T postgres pg_isready -U medispa -d medispa_dashboard 2>$null
} while ($LASTEXITCODE -ne 0)

Write-Host ""

# Start the application
Write-Host "🚀 Starting Next.js application..." -ForegroundColor Blue
try {
  & $dockerComposeCmd up --build app
}
catch {
  Write-Host "❌ Failed to start the application. Check the logs above." -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "💡 To start Prisma Studio (database GUI), run:" -ForegroundColor Yellow
Write-Host "   $dockerComposeCmd --profile tools up prisma-studio" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Development environment is ready!" -ForegroundColor Green
Write-Host "   - Application: http://localhost:3000" -ForegroundColor White
Write-Host "   - Database: localhost:5432" -ForegroundColor White
Write-Host "   - Redis: localhost:6379" -ForegroundColor White
