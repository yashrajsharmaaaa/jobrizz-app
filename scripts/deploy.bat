@echo off
REM JobRizz Production Deployment Script for Windows

echo 🚀 Starting JobRizz Production Deployment
echo ========================================

REM Check if required files exist
if not exist ".env.production" (
    echo ❌ .env.production file not found. Please create it first.
    exit /b 1
)

if not exist "backend\.env.production" (
    echo ❌ backend\.env.production file not found. Please create it first.
    exit /b 1
)

echo 📦 Building production images...
docker-compose -f docker-compose.prod.yml build --no-cache

echo 🛑 Stopping existing containers...
docker-compose -f docker-compose.prod.yml down

echo 🗄️  Running database migrations...
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

echo 🌱 Seeding production database...
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:seed

echo 🚀 Starting production services...
docker-compose -f docker-compose.prod.yml up -d

echo ⏳ Waiting for services to be healthy...
timeout /t 30 /nobreak >nul

REM Health checks
echo 🔍 Checking service health...
curl -f http://localhost:3001/api/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ Backend is healthy
) else (
    echo ❌ Backend health check failed
    exit /b 1
)

curl -f http://localhost >nul 2>&1
if not errorlevel 1 (
    echo ✅ Frontend is healthy
) else (
    echo ❌ Frontend health check failed
    exit /b 1
)

echo.
echo 🎉 Deployment completed successfully!
echo ========================================
echo Frontend: http://localhost
echo Backend API: http://localhost:3001
echo Health Check: http://localhost:3001/api/health
echo.
echo To view logs: docker-compose -f docker-compose.prod.yml logs -f
echo To stop: docker-compose -f docker-compose.prod.yml down

pause