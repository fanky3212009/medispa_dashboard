#!/usr/bin/env pwsh

# Medispa Dashboard - Database Reset Script (PowerShell)
# This script resets the database and optionally seeds it with sample data

param(
  [switch]$Help,
  [switch]$Force,
  [switch]$NoSeed
)

if ($Help) {
  Write-Host "Medispa Dashboard - Database Reset Script" -ForegroundColor Blue
  Write-Host ""
  Write-Host "Usage: .\scripts\reset-db.ps1 [-Force] [-NoSeed] [-Help]" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Options:" -ForegroundColor Green
  Write-Host "  -Force    Skip confirmation prompt"
  Write-Host "  -NoSeed   Skip database seeding"
  Write-Host "  -Help     Show this help message"
  Write-Host ""
  exit 0
}

Write-Host "🔄 Resetting Medispa Dashboard Database..." -ForegroundColor Blue

# Function to determine docker compose command
function Get-DockerComposeCommand {
  if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    return "docker-compose"
  }
  elseif (docker compose version 2>$null) {
    return "docker compose"
  }
  else {
    Write-Host "❌ Docker Compose is not available. Please install Docker Compose." -ForegroundColor Red
    exit 1
  }
}

$dockerComposeCmd = Get-DockerComposeCommand

# Check if containers are running
$postgresStatus = & $dockerComposeCmd ps postgres 2>$null
if (-not ($postgresStatus -match "Up")) {
  Write-Host "❌ PostgreSQL container is not running. Please start the development environment first." -ForegroundColor Red
  Write-Host "Run: .\scripts\start-dev.ps1" -ForegroundColor Yellow
  exit 1
}

if (-not $Force) {
  Write-Host "⚠️  This will completely reset your database and remove all data!" -ForegroundColor Yellow
  $response = Read-Host "Are you sure you want to continue? (y/N)"
    
  if ($response -notmatch "^[Yy]") {
    Write-Host "🚫 Operation cancelled." -ForegroundColor Blue
    exit 0
  }
}

Write-Host "🗑️  Dropping existing database..." -ForegroundColor Yellow
& $dockerComposeCmd exec postgres psql -U medispa -d postgres -c "DROP DATABASE IF EXISTS medispa_dashboard;"

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Failed to drop database. Check if containers are running properly." -ForegroundColor Red
  exit 1
}

Write-Host "🏗️  Creating new database..." -ForegroundColor Blue
& $dockerComposeCmd exec postgres psql -U medispa -d postgres -c "CREATE DATABASE medispa_dashboard;"

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Failed to create database." -ForegroundColor Red
  exit 1
}

Write-Host "📊 Running Prisma migrations..." -ForegroundColor Blue
& $dockerComposeCmd exec app npx prisma db push --force-reset

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Failed to run Prisma migrations." -ForegroundColor Red
  exit 1
}

Write-Host "🔧 Generating Prisma client..." -ForegroundColor Blue
& $dockerComposeCmd exec app npx prisma generate

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Failed to generate Prisma client." -ForegroundColor Red
  exit 1
}

# Ask if user wants to seed the database (unless NoSeed is specified)
if (-not $NoSeed) {
  Write-Host ""
  $seedResponse = Read-Host "🌱 Would you like to seed the database with sample data? (y/N)"
    
  if ($seedResponse -match "^[Yy]") {
    if (Test-Path "prisma\seed.ts") {
      Write-Host "🌱 Seeding database with sample data..." -ForegroundColor Blue
      & $dockerComposeCmd exec app pnpm db:seed
            
      if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
      }
      else {
        Write-Host "⚠️  Database seeding failed, but the database was reset successfully." -ForegroundColor Yellow
      }
    }
    else {
      Write-Host "⚠️  No seed file found (prisma\seed.ts). Skipping seeding." -ForegroundColor Yellow
    }
  }
}

Write-Host ""
Write-Host "🎉 Database reset completed successfully!" -ForegroundColor Green
Write-Host "📝 Next steps:" -ForegroundColor Blue
Write-Host "  1. Your application should automatically reconnect" -ForegroundColor White
Write-Host "  2. Check the logs: $dockerComposeCmd logs app" -ForegroundColor White
Write-Host "  3. Visit: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Pro tip: You can also use Prisma Studio to inspect your database:" -ForegroundColor Yellow
Write-Host "   $dockerComposeCmd --profile tools up prisma-studio" -ForegroundColor White
Write-Host "   Then visit: http://localhost:5555" -ForegroundColor White
