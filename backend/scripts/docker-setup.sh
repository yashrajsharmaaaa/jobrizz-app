#!/bin/bash

# JobRizz Backend Docker Setup Script
# This script helps set up the development environment with Docker

set -e

echo "🚀 Setting up JobRizz Backend Development Environment"
echo "=================================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install docker-compose and try again."
    exit 1
fi

echo "✅ docker-compose is available"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p docker/postgres
mkdir -p uploads
mkdir -p logs

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down --remove-orphans || true

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose pull

# Start the services
echo "🚀 Starting PostgreSQL and Redis..."
docker-compose up -d postgres redis

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
timeout=60
counter=0

while [ $counter -lt $timeout ]; do
    if docker-compose ps | grep -q "healthy"; then
        echo "✅ Services are healthy!"
        break
    fi
    echo "⏳ Waiting for services... ($counter/$timeout)"
    sleep 2
    counter=$((counter + 2))
done

if [ $counter -ge $timeout ]; then
    echo "❌ Services failed to start within $timeout seconds"
    docker-compose logs
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env file with your configuration"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️  Setting up database schema..."
npm run db:push

echo ""
echo "🎉 Setup complete!"
echo "=================================================="
echo "Services running:"
echo "  📊 PostgreSQL: localhost:5432"
echo "  🔴 Redis: localhost:6379"
echo "  🔧 pgAdmin: http://localhost:5050 (admin@jobrizz.com / admin123)"
echo ""
echo "Next steps:"
echo "  1. Edit .env file with your OpenAI API key"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Run 'npm run db:seed' to add sample data (optional)"
echo ""
echo "Useful commands:"
echo "  🔍 View logs: docker-compose logs -f"
echo "  🛑 Stop services: docker-compose down"
echo "  🔄 Restart services: docker-compose restart"
echo "  🗄️  Database shell: docker-compose exec postgres psql -U jobrizz_user -d jobrizz_dev"