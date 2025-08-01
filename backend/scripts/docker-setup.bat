@echo off
REM JobRizz Backend Docker Setup Script for Windows
REM This script helps set up the development environment with Docker

echo 🚀 Setting up JobRizz Backend Development Environment
echo ==================================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

echo ✅ Docker is running

REM Check if docker-compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ docker-compose is not installed. Please install docker-compose and try again.
    exit /b 1
)

echo ✅ docker-compose is available

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "docker\postgres" mkdir docker\postgres
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down --remove-orphans 2>nul

REM Pull latest images
echo 📥 Pulling latest Docker images...
docker-compose pull

REM Start the services
echo 🚀 Starting PostgreSQL and Redis...
docker-compose up -d postgres redis

REM Wait for services to be healthy
echo ⏳ Waiting for services to be ready...
set timeout=60
set counter=0

:wait_loop
if %counter% geq %timeout% (
    echo ❌ Services failed to start within %timeout% seconds
    docker-compose logs
    exit /b 1
)

docker-compose ps | findstr "healthy" >nul 2>&1
if not errorlevel 1 (
    echo ✅ Services are healthy!
    goto services_ready
)

echo ⏳ Waiting for services... (%counter%/%timeout%)
timeout /t 2 /nobreak >nul
set /a counter+=2
goto wait_loop

:services_ready

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env >nul
    echo 📝 Please edit .env file with your configuration
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npm run db:generate

REM Push database schema
echo 🗄️  Setting up database schema...
npm run db:push

echo.
echo 🎉 Setup complete!
echo ==================================================
echo Services running:
echo   📊 PostgreSQL: localhost:5432
echo   🔴 Redis: localhost:6379
echo   🔧 pgAdmin: http://localhost:5050 (admin@jobrizz.com / admin123)
echo.
echo Next steps:
echo   1. Edit .env file with your OpenAI API key
echo   2. Run 'npm run dev' to start the development server
echo   3. Run 'npm run db:seed' to add sample data (optional)
echo.
echo Useful commands:
echo   🔍 View logs: docker-compose logs -f
echo   🛑 Stop services: docker-compose down
echo   🔄 Restart services: docker-compose restart
echo   🗄️  Database shell: docker-compose exec postgres psql -U jobrizz_user -d jobrizz_dev

pause