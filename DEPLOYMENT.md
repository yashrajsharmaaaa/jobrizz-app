# JobRizz Production Deployment Guide

This guide covers deploying JobRizz to production environments.

## 🚀 Quick Deployment

### Prerequisites
- Docker and Docker Compose installed
- Production database (PostgreSQL)
- Production Redis instance
- OpenAI API key
- Domain names for frontend and backend

### 1. Configure Environment Variables

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://api.yourapp.com
VITE_APP_NAME=JobRizz
VITE_ENVIRONMENT=production
```

**Backend (backend/.env.production):**
```env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/jobrizz_prod"
REDIS_URL="redis://host:6379"
JWT_SECRET="your-super-secure-32-char-secret"
OPENAI_API_KEY="your-openai-key"
FRONTEND_URL="https://yourapp.com"
```

### 2. Deploy with Script

**Windows:**
```bash
npm run deploy:prod:win
```

**Mac/Linux:**
```bash
npm run deploy:prod
```

## 🌐 Hosting Options

### Option 1: VPS/Dedicated Server
- **Recommended for**: Full control, custom configurations
- **Providers**: DigitalOcean, Linode, AWS EC2, Google Cloud
- **Setup**: Use Docker Compose with the provided scripts

### Option 2: Platform as a Service (PaaS)
- **Frontend**: Vercel, Netlify, AWS Amplify
- **Backend**: Railway, Render, Heroku, AWS App Runner

### Option 3: Container Platforms
- **Recommended for**: Scalability, enterprise
- **Providers**: AWS ECS, Google Cloud Run, Azure Container Instances

## 📋 Manual Deployment Steps

### 1. Database Setup
```bash
# Create production database
createdb jobrizz_prod

# Run migrations
cd backend
npx prisma migrate deploy
npx prisma generate
npm run db:seed
```

### 2. Build Applications
```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
```

### 3. Start Services
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or manually
cd backend && npm start
# Serve frontend with nginx or similar
```

## 🔒 Security Checklist

### Environment Variables
- [ ] Change default JWT_SECRET to a secure 32+ character string
- [ ] Use strong database passwords
- [ ] Set secure Redis password
- [ ] Configure CORS for your domain only
- [ ] Set proper FRONTEND_URL

### SSL/HTTPS
- [ ] Configure SSL certificates (Let's Encrypt recommended)
- [ ] Force HTTPS redirects
- [ ] Update CORS and API URLs to use HTTPS

### Database Security
- [ ] Use connection pooling
- [ ] Enable database SSL
- [ ] Restrict database access by IP
- [ ] Regular backups configured

### Server Security
- [ ] Keep Docker images updated
- [ ] Configure firewall rules
- [ ] Enable fail2ban or similar
- [ ] Regular security updates

## 🔧 Configuration for Different Platforms

### Vercel (Frontend)
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "handle": "filesystem"
    },
    {
      "src": "/.*",
      "dest": "/index.html"
    }
  ]
}
```

### Railway (Backend)
```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "backend/Dockerfile"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/health"
healthcheckTimeout = 100
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

### Render (Backend)
```yaml
services:
  - type: web
    name: jobrizz-backend
    env: docker
    dockerfilePath: ./backend/Dockerfile
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: jobrizz-db
          property: connectionString
```

## 📊 Monitoring & Logging

### Health Checks
- Frontend: `https://yourapp.com`
- Backend: `https://api.yourapp.com/api/health`
- Database: `https://api.yourapp.com/api/health/db`
- Cache: `https://api.yourapp.com/api/health/cache`

### Logging
```bash
# View application logs
docker-compose -f docker-compose.prod.yml logs -f backend

# View all logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Monitoring Tools
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: New Relic, DataDog
- **Errors**: Sentry, Bugsnag
- **Analytics**: Google Analytics, Mixpanel

## 🔄 Updates & Maintenance

### Updating the Application
```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
npm run deploy:prod
```

### Database Migrations
```bash
# Run new migrations
docker-compose -f docker-compose.prod.yml run --rm backend npx prisma migrate deploy
```

### Backup Strategy
```bash
# Database backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Redis backup
redis-cli --rdb backup_$(date +%Y%m%d_%H%M%S).rdb
```

## 🆘 Troubleshooting

### Common Issues

**1. CORS Errors**
- Check FRONTEND_URL in backend environment
- Verify domain configuration

**2. Database Connection Issues**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database is running

**3. Build Failures**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors

**4. Performance Issues**
- Enable Redis caching
- Optimize database queries
- Use CDN for static assets

### Getting Help
- Check application logs
- Verify environment variables
- Test health endpoints
- Review security settings

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer configuration
- Multiple backend instances
- Database read replicas
- Redis clustering

### Performance Optimization
- CDN for static assets
- Database indexing
- Caching strategies
- Image optimization

This deployment guide ensures your JobRizz application is production-ready with proper security, monitoring, and scalability considerations.