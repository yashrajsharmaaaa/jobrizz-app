# JobRizz Backend Setup Guide

This guide will help you set up the JobRizz backend with Docker, PostgreSQL, and Redis.

## Prerequisites

- ✅ Docker Desktop installed and running
- ✅ Node.js 18+ installed
- ✅ Git installed

## Quick Setup (Recommended)

### For Windows Users:
```bash
cd backend
npm run docker:setup:win
```

### For Mac/Linux Users:
```bash
cd backend
npm run docker:setup
```

This script will automatically:
- Start PostgreSQL and Redis containers
- Create the database schema
- Install dependencies
- Set up the development environment

## Manual Setup

If you prefer to set up manually or the script doesn't work:

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Docker Services
```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Optional: Start pgAdmin for database management
docker-compose up -d pgadmin
```

### 4. Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your configuration (especially OPENAI_API_KEY)
```

### 5. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Create database schema
npm run db:push

# Optional: Seed with sample data
npm run db:seed
```

### 6. Start Development Server
```bash
npm run dev
```

## Verify Setup

### Check Services
Visit these URLs to verify everything is working:

- **API Health Check**: http://localhost:3001/api/health
- **Database Health**: http://localhost:3001/api/health/db
- **Cache Health**: http://localhost:3001/api/health/cache
- **pgAdmin** (optional): http://localhost:5050

### pgAdmin Login
- **Email**: admin@jobrizz.com
- **Password**: admin123

### Test Database Connection
```bash
# Connect to PostgreSQL directly
docker-compose exec postgres psql -U jobrizz_user -d jobrizz_dev

# Or use the npm script
npm run db:studio
```

## Environment Configuration

### Required Environment Variables

Edit your `.env` file with these values:

```env
# Database (already configured for Docker)
DATABASE_URL="postgresql://jobrizz_user:jobrizz_password@localhost:5432/jobrizz_dev"

# Redis (already configured for Docker)
REDIS_URL="redis://localhost:6379"

# JWT Secret (generate a secure secret)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"

# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Frontend URL (should match your React app)
FRONTEND_URL="http://localhost:5173"
```

### Optional Configuration

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000    # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100    # 100 requests per window
```

## Docker Services

### Service Overview

| Service | Port | Purpose | URL |
|---------|------|---------|-----|
| PostgreSQL | 5432 | Main database | localhost:5432 |
| Redis | 6379 | Caching & sessions | localhost:6379 |
| pgAdmin | 5050 | Database management | http://localhost:5050 |

### Useful Docker Commands

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart services
docker-compose restart

# Clean up (removes volumes - BE CAREFUL!)
docker-compose down -v --remove-orphans

# Connect to PostgreSQL
docker-compose exec postgres psql -U jobrizz_user -d jobrizz_dev

# Connect to Redis
docker-compose exec redis redis-cli
```

## Development Workflow

### Starting Development
```bash
# Start Docker services
docker-compose up -d

# Start the development server
npm run dev
```

### Database Operations
```bash
# View database in browser
npm run db:studio

# Reset database schema
npm run db:push

# Create a new migration
npm run db:migrate

# Seed database with sample data
npm run db:seed
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Troubleshooting

### Common Issues

#### 1. Docker Services Won't Start
```bash
# Check if Docker is running
docker info

# Check for port conflicts
netstat -an | findstr :5432
netstat -an | findstr :6379

# Stop conflicting services
# Windows: Stop PostgreSQL/Redis services in Services.msc
# Mac: brew services stop postgresql redis
```

#### 2. Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

#### 3. Permission Issues (Mac/Linux)
```bash
# Make setup script executable
chmod +x scripts/docker-setup.sh

# Fix Docker permissions
sudo chown -R $USER:$USER .
```

#### 4. Port Already in Use
If you get "port already in use" errors:

```bash
# Find what's using the port
# Windows:
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5432 | xargs kill -9
```

### Reset Everything
If you need to start fresh:

```bash
# Stop and remove all containers and volumes
docker-compose down -v --remove-orphans

# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Run setup again
npm run docker:setup
```

## Next Steps

Once setup is complete:

1. ✅ Verify all health checks pass
2. ✅ Add your OpenAI API key to `.env`
3. ✅ Test the API endpoints
4. ✅ Start implementing authentication (next task)

## Getting Help

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables in `.env`
3. Ensure Docker Desktop is running
4. Check for port conflicts
5. Try the reset procedure above

The setup should take about 5-10 minutes on first run. Subsequent starts will be much faster as Docker images are cached.