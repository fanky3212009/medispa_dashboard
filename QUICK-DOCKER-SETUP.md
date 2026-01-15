# 🚀 Quick Docker Setup Guide

Get your Medispa Dashboard running with Docker in 5 minutes!

## ⚡ Quick Start (TL;DR)

```bash
# 1. Copy environment file
cp .env.docker .env.local

# 2. Start everything (Windows PowerShell)
.\scripts\start-dev.ps1

# 3. Or start manually
docker-compose up --build

# 4. Visit http://localhost:3000
```

## 📋 What You Get

✅ **Complete Development Environment**

- Next.js app with hot reload
- PostgreSQL database
- Redis for caching
- Prisma Studio (optional)

✅ **Easy Commands**

- `.\scripts\start-dev.ps1` - Start everything
- `.\scripts\reset-db.ps1` - Reset database
- `docker-compose down` - Stop everything

✅ **Persistent Data**

- Database data survives restarts
- No setup required after first run

## 🔧 Available Services

| Service           | URL                   | Purpose                  |
| ----------------- | --------------------- | ------------------------ |
| **App**           | http://localhost:3000 | Your Next.js application |
| **Database**      | localhost:5432        | PostgreSQL database      |
| **Prisma Studio** | http://localhost:5555 | Database GUI (optional)  |

## 🐛 Quick Troubleshooting

**Port in use?**

```bash
docker-compose down
docker-compose up
```

**Database issues?**

```bash
.\scripts\reset-db.ps1
```

**Need clean start?**

```bash
docker-compose down -v
docker-compose up --build
```

## 📖 Full Documentation

See [DOCKER-README.md](./DOCKER-README.md) for complete documentation.

---

Happy coding! 🎉
