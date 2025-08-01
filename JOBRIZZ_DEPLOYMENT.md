# 🚀 JobRizz.com Deployment Guide

## 🎯 Your Configuration

- **Frontend**: https://jobrizz.com
- **Backend API**: https://api.jobrizz.com
- **Domain**: jobrizz.com (to be registered)

## 📋 Deployment Options

### **Option A: Vercel + Railway (Recommended) - $5/month**

#### **Step 1: Register Domain**
1. Go to [Namecheap](https://www.namecheap.com)
2. Search for "jobrizz.com"
3. Purchase domain (~$10/year)
4. Keep DNS management with Namecheap for now

#### **Step 2: Set Up Railway (Backend)**
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your backend repository
5. Add services:
   - PostgreSQL database
   - Redis cache
6. Set environment variables (from backend/.env.production)
7. Deploy automatically

#### **Step 3: Set Up Vercel (Frontend)**
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Select your frontend repository
5. Set environment variables (from .env.production)
6. Deploy automatically

#### **Step 4: Configure DNS**
In Namecheap DNS settings:
```
A     @     -> Vercel IP (provided by Vercel)
CNAME api   -> your-railway-app.railway.app
CNAME www   -> @
```

---

### **Option B: Free Tier Setup - $0/month**

#### **Backend: Render (Free)**
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Choose "Web Service"
4. Set build command: `npm run build`
5. Set start command: `npm start`

#### **Database: Neon (Free)**
1. Go to [Neon.tech](https://neon.tech)
2. Create free PostgreSQL database
3. Copy connection string

#### **Cache: Upstash (Free)**
1. Go to [Upstash.com](https://upstash.com)
2. Create free Redis database
3. Copy connection string

#### **Frontend: Vercel (Free)**
Same as Option A

---

### **Option C: VPS Setup - $6/month**

#### **Server: DigitalOcean Droplet**
1. Create $6/month droplet (Ubuntu)
2. Install Docker and Docker Compose
3. Clone your repository
4. Run: `npm run deploy:prod`

## 🔧 Environment Variables Setup

### **Railway Environment Variables:**
```
NODE_ENV=production
DATABASE_URL=(Railway provides this)
REDIS_URL=(Railway provides this)
JWT_SECRET=e0ee6fb4ab5be0a93216a69b5a7fbfe9c1689e1e26c5c51ec7b9f7ffd0026720
OPENAI_API_KEY=your-openai-key
FRONTEND_URL=https://jobrizz.com
```

### **Vercel Environment Variables:**
```
VITE_API_BASE_URL=https://api.jobrizz.com
VITE_APP_NAME=JobRizz
VITE_ENVIRONMENT=production
```

## 📝 Next Steps Checklist

### **Domain Registration:**
- [ ] Check if jobrizz.com is available
- [ ] Register domain at Namecheap
- [ ] Keep DNS management with registrar

### **Hosting Setup:**
- [ ] Choose hosting option (A, B, or C)
- [ ] Set up backend hosting
- [ ] Set up frontend hosting
- [ ] Configure environment variables

### **DNS Configuration:**
- [ ] Point @ to frontend
- [ ] Point api to backend
- [ ] Add www redirect
- [ ] Verify SSL certificates

### **Testing:**
- [ ] Test https://jobrizz.com
- [ ] Test https://api.jobrizz.com/api/health
- [ ] Test user registration
- [ ] Test resume upload

## 🆘 Troubleshooting

### **Common Issues:**
1. **DNS not propagating**: Wait 24-48 hours
2. **SSL certificate issues**: Check domain verification
3. **CORS errors**: Verify FRONTEND_URL in backend
4. **Database connection**: Check DATABASE_URL format

### **Health Checks:**
- Frontend: https://jobrizz.com
- Backend: https://api.jobrizz.com/api/health
- Database: https://api.jobrizz.com/api/health/db

## 💡 Pro Tips

1. **Start with Option A** (Vercel + Railway) for simplicity
2. **Test everything locally** before deploying
3. **Set up monitoring** after deployment
4. **Enable automatic deployments** from GitHub
5. **Keep backups** of your database

Which option would you like to proceed with?