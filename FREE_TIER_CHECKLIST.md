# ✅ JobRizz Free Tier Deployment Checklist

## 🎯 Your Free Setup

- **Frontend**: https://jobrizz.vercel.app (Free)
- **Backend**: https://jobrizz-api.onrender.com (Free)
- **Database**: Neon PostgreSQL (Free - 512MB)
- **Cache**: Upstash Redis (Free - 10K commands/day)
- **Total Cost**: $0/month

## 📋 Step-by-Step Checklist

### **Phase 1: Database Setup**
- [ ] **1.1** Sign up at [Neon.tech](https://neon.tech) with GitHub
- [ ] **1.2** Create project "JobRizz"
- [ ] **1.3** Copy PostgreSQL connection string
- [ ] **1.4** Test connection (optional)

### **Phase 2: Cache Setup**
- [ ] **2.1** Sign up at [Upstash.com](https://upstash.com) with GitHub
- [ ] **2.2** Create Redis database "jobrizz-cache"
- [ ] **2.3** Copy Redis connection string
- [ ] **2.4** Test connection (optional)

### **Phase 3: Backend Deployment**
- [ ] **3.1** Sign up at [Render.com](https://render.com) with GitHub
- [ ] **3.2** Create new Web Service
- [ ] **3.3** Connect your GitHub repository
- [ ] **3.4** Set root directory to "backend"
- [ ] **3.5** Configure build/start commands
- [ ] **3.6** Add all environment variables
- [ ] **3.7** Deploy and wait for build
- [ ] **3.8** Test: https://your-app.onrender.com/api/health

### **Phase 4: Frontend Deployment**
- [ ] **4.1** Sign up at [Vercel.com](https://vercel.com) with GitHub
- [ ] **4.2** Import your repository
- [ ] **4.3** Set project name to "jobrizz"
- [ ] **4.4** Add environment variables
- [ ] **4.5** Deploy and wait for build
- [ ] **4.6** Test: https://jobrizz.vercel.app

### **Phase 5: Integration Testing**
- [ ] **5.1** Test user registration
- [ ] **5.2** Test user login
- [ ] **5.3** Test resume upload
- [ ] **5.4** Test AI features
- [ ] **5.5** Check all API endpoints

## 🔧 Environment Variables Reference

### **Render (Backend) Environment Variables:**
```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
REDIS_URL=redis://default:password@region.upstash.io:port
JWT_SECRET=e0ee6fb4ab5be0a93216a69b5a7fbfe9c1689e1e26c5c51ec7b9f7ffd0026720
OPENAI_API_KEY=sk-your-openai-key-here
FRONTEND_URL=https://jobrizz.vercel.app
PORT=3001
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### **Vercel (Frontend) Environment Variables:**
```
VITE_API_BASE_URL=https://jobrizz-api.onrender.com
VITE_APP_NAME=JobRizz
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
VITE_ENABLE_BACKEND_AUTH=true
VITE_ENABLE_REAL_TIME_ANALYSIS=false
VITE_ENABLE_OFFLINE_MODE=false
VITE_DEBUG_API_CALLS=false
VITE_DEBUG_AUTH=false
```

## ⚠️ Free Tier Limitations

### **Render (Backend):**
- **Sleep after 15 minutes** of inactivity
- **750 hours/month** (enough for testing)
- **Cold starts** (3-5 seconds to wake up)
- **512MB RAM**

### **Neon (Database):**
- **512MB storage**
- **1 database**
- **No connection pooling**
- **Automatic sleep** after inactivity

### **Upstash (Redis):**
- **10,000 commands/day**
- **256MB storage**
- **Single region**

### **Vercel (Frontend):**
- **100GB bandwidth/month**
- **Unlimited static sites**
- **Custom domains** (if you get one later)

## 🚀 Deployment Commands

### **For Backend (if needed):**
```bash
cd backend
npm install
npm run build
npm start
```

### **For Frontend (if needed):**
```bash
npm install
npm run build
```

## 🔍 Testing Your Deployment

### **Health Checks:**
1. **Backend Health**: https://jobrizz-api.onrender.com/api/health
2. **Frontend**: https://jobrizz.vercel.app
3. **Database**: https://jobrizz-api.onrender.com/api/health/db
4. **Cache**: https://jobrizz-api.onrender.com/api/health/cache

### **Functional Tests:**
1. **Registration**: Create a new account
2. **Login**: Sign in with created account
3. **Resume Upload**: Upload a test resume
4. **AI Analysis**: Test AI features (if OpenAI key is set)

## 🆘 Troubleshooting

### **Common Issues:**

**1. Backend won't start:**
- Check environment variables
- Verify database connection string
- Check build logs in Render

**2. Frontend can't connect to backend:**
- Verify VITE_API_BASE_URL
- Check CORS settings (FRONTEND_URL in backend)
- Wait for backend to wake up from sleep

**3. Database connection issues:**
- Verify Neon connection string format
- Check if database is active
- Ensure SSL mode is required

**4. Redis connection issues:**
- Verify Upstash connection string
- Check Redis URL format
- Ensure region matches

## 💡 Pro Tips

1. **First deployment takes time** - be patient
2. **Backend sleeps** - first request after inactivity is slow
3. **Use GitHub** for automatic deployments
4. **Monitor usage** to stay within free limits
5. **Test locally first** before deploying

## 🔄 Next Steps After Deployment

1. **Test everything thoroughly**
2. **Monitor usage and performance**
3. **Consider upgrading** if you need more resources
4. **Set up custom domain** (optional, costs ~$10/year)
5. **Add monitoring and analytics**

Ready to start? Let's begin with **Step 1: Database Setup**! 🚀