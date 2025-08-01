# JobRizz - AI-Powered Resume Builder

An intelligent resume builder and analysis platform that helps users create, optimize, and analyze their resumes using AI technology.

## 🚀 Features

- **AI-Powered Resume Analysis** - Get intelligent suggestions for improving your resume
- **ATS Compatibility Scoring** - Ensure your resume passes Applicant Tracking Systems
- **Drag & Drop Editor** - Intuitive resume building interface
- **Multiple Templates** - Professional resume templates
- **Job Matching** - AI-powered job description matching
- **PDF Export** - Generate high-quality PDF resumes
- **Real-time Preview** - See changes as you make them

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **React DnD** for drag-and-drop functionality

### Backend
- **Node.js** with Express.js and TypeScript
- **PostgreSQL** with Prisma ORM
- **Redis** for caching
- **JWT** authentication
- **OpenAI API** integration

## 🌐 Live Demo

- **Frontend**: [https://jobrizz.vercel.app](https://jobrizz.vercel.app)
- **Backend API**: [https://jobrizz-api.onrender.com](https://jobrizz-api.onrender.com)

## 🏗️ Architecture

```
Frontend (React) ↔ Backend API (Node.js) ↔ Database (PostgreSQL)
                                        ↔ Cache (Redis)
                                        ↔ AI Services (OpenAI)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- Redis
- OpenAI API key

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashrajsharmaaaa/jobrizz-app.git
   cd jobrizz-app
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Frontend
   cp .env.example .env.development
   
   # Backend
   cd backend
   cp .env.example .env
   ```

5. **Start development servers**
   ```bash
   # Frontend (in root directory)
   npm run dev
   
   # Backend (in backend directory)
   cd backend
   npm run dev
   ```

## 📦 Deployment

The application is deployed using:
- **Frontend**: Vercel (Free tier)
- **Backend**: Render (Free tier)
- **Database**: Neon PostgreSQL (Free tier)
- **Cache**: Upstash Redis (Free tier)

## 🔧 Environment Variables

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://jobrizz-api.onrender.com
VITE_APP_NAME=JobRizz
VITE_ENVIRONMENT=production
```

### Backend (backend/.env.production)
```env
NODE_ENV=production
DATABASE_URL=your-postgresql-connection-string
REDIS_URL=your-redis-connection-string
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=https://jobrizz.vercel.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for AI capabilities
- Vercel for frontend hosting
- Render for backend hosting
- Neon for database hosting
- Upstash for Redis hosting

## 📞 Support

If you have any questions or need help, please open an issue or contact us.

---

Made with ❤️ for job seekers everywhere