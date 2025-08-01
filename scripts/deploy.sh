#!/bin/bash

# JobRizz Production Deployment Script

set -e

echo "🚀 Starting JobRizz Production Deployment"
echo "========================================"

# Check if required files exist
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found. Please create it first."
    exit 1
fi

if [ ! -f "backend/.env.production" ]; then
    echo "❌ backend/.env.production file not found. Please create it first."
    exit 1
fi

# Load environment variables
source .env.production

echo "📦 Building production images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy

echo "🌱 Seeding production database..."
docker-compose -f docker-compose.prod.yml run --rm backend npm run db:seed

echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health checks
echo "🔍 Checking service health..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    exit 1
fi

if curl -f http://localhost > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "========================================"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:3001"
echo "Health Check: http://localhost:3001/api/health"
echo ""
echo "To view logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "To stop: docker-compose -f docker-compose.prod.yml down"