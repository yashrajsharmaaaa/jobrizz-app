# Backend Integration Architecture

This document outlines the architecture and implementation plan for integrating the JobRizz frontend with a backend server and database.

## Current State

The application currently operates as a **client-side only** application with:
- Local PDF generation using jsPDF
- Client-side resume parsing and analysis
- Local storage for data persistence
- No user authentication or server communication

## Backend Integration Plan

### Phase 1: API Foundation
- [ ] Set up Express.js/Node.js backend server
- [ ] Implement basic API endpoints structure
- [ ] Add CORS and security middleware
- [ ] Set up environment configuration
- [ ] Implement health check endpoints

### Phase 2: Database Setup
- [ ] Choose database (PostgreSQL recommended)
- [ ] Design database schema for:
  - Users and authentication
  - Resume documents and analysis
  - Export jobs and file storage
  - User preferences and settings
- [ ] Set up database migrations
- [ ] Implement database connection and ORM (Prisma/TypeORM)

### Phase 3: Authentication System
- [ ] Implement JWT-based authentication
- [ ] Add user registration and login endpoints
- [ ] Update frontend to handle auth tokens
- [ ] Add protected routes and middleware
- [ ] Implement password reset functionality

### Phase 4: Resume Management API
- [ ] File upload endpoints with validation
- [ ] Resume storage and retrieval
- [ ] Server-side resume parsing (using existing logic)
- [ ] Analysis data persistence
- [ ] Version control for resume edits

### Phase 5: PDF Export Service
- [ ] Server-side PDF generation using Puppeteer/jsPDF
- [ ] File storage system (AWS S3/local storage)
- [ ] Export job queue system
- [ ] Download URL generation with expiration
- [ ] Export history tracking

### Phase 6: AI Integration
- [ ] Integrate with AI services (OpenAI/Claude)
- [ ] Server-side recommendation generation
- [ ] Resume correction and improvement
- [ ] Job matching algorithms
- [ ] Usage tracking and rate limiting

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Storage │    │   File Storage  │    │   Redis Cache   │
│   (Fallback)    │    │   (AWS S3)      │    │   (Sessions)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscription_type VARCHAR(20) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  original_content TEXT NOT NULL,
  corrected_content TEXT,
  analysis_data JSONB,
  template_id VARCHAR(50),
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Export Jobs Table
```sql
CREATE TABLE export_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  format VARCHAR(10) NOT NULL,
  version VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  file_url VARCHAR(500),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile

### Resume Management
- `POST /api/resume/upload` - Upload and analyze resume
- `GET /api/resume/list` - List user's resumes
- `GET /api/resume/:id` - Get specific resume
- `PUT /api/resume/:id` - Update resume
- `DELETE /api/resume/:id` - Delete resume

### PDF Export
- `POST /api/resume/export/pdf` - Request PDF export
- `GET /api/resume/export/status/:id` - Check export status
- `GET /api/resume/download/:id` - Download exported file

### AI Services
- `POST /api/ai/analyze` - Analyze resume content
- `POST /api/ai/correct` - Get AI corrections
- `POST /api/ai/recommendations` - Get recommendations
- `POST /api/ai/job-match` - Match with job descriptions

## Implementation Strategy

### 1. Hybrid Approach
The application is designed to work in a **hybrid mode**:
- **Client-side fallback**: Current functionality continues to work
- **Server-side enhancement**: New features are added progressively
- **Graceful degradation**: If server is unavailable, client-side features still work

### 2. Progressive Enhancement
Features are added incrementally:
1. Basic API and database setup
2. User authentication (optional initially)
3. Server-side resume processing
4. Enhanced PDF generation
5. AI-powered features
6. Advanced analytics and reporting

### 3. Data Migration
- Existing local storage data can be migrated to server
- Users can continue using the app during migration
- Sync mechanism handles offline/online transitions

## File Structure for Backend

```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── resumeController.ts
│   │   ├── exportController.ts
│   │   └── aiController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Resume.ts
│   │   └── ExportJob.ts
│   ├── services/
│   │   ├── resumeParser.ts
│   │   ├── pdfGenerator.ts
│   │   ├── aiService.ts
│   │   └── fileStorage.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── resume.ts
│   │   ├── export.ts
│   │   └── ai.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── validation.ts
│   │   └── helpers.ts
│   └── app.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── package.json
└── README.md
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobrizz
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h

# File Storage
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=jobrizz-files
AWS_REGION=us-east-1

# AI Services
OPENAI_API_KEY=your-openai-key
CLAUDE_API_KEY=your-claude-key

# Application
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## Deployment Strategy

### Development
- Frontend: Vite dev server (localhost:5173)
- Backend: Node.js server (localhost:3001)
- Database: Local PostgreSQL
- File Storage: Local filesystem

### Production
- Frontend: Static hosting (Vercel/Netlify)
- Backend: Container deployment (Docker + AWS ECS/Railway)
- Database: Managed PostgreSQL (AWS RDS/Supabase)
- File Storage: AWS S3
- CDN: CloudFront for file delivery

## Migration Timeline

### Week 1-2: Foundation
- Set up backend project structure
- Implement basic API endpoints
- Set up database and migrations
- Create Docker configuration

### Week 3-4: Authentication
- Implement user registration/login
- Add JWT authentication
- Update frontend auth handling
- Test authentication flow

### Week 5-6: Resume Management
- Implement resume upload/storage
- Add server-side parsing
- Create resume CRUD operations
- Test with existing frontend

### Week 7-8: PDF Export
- Implement server-side PDF generation
- Add file storage system
- Create export job queue
- Update frontend export flow

### Week 9-10: AI Integration
- Integrate AI services
- Implement recommendation system
- Add usage tracking
- Test AI features

### Week 11-12: Deployment & Testing
- Set up production environment
- Deploy and test all features
- Performance optimization
- User acceptance testing

## Benefits of Backend Integration

1. **Scalability**: Handle multiple users and large files
2. **Performance**: Server-side processing for heavy operations
3. **Security**: Secure data storage and API access
4. **Features**: Advanced AI capabilities and analytics
5. **Reliability**: Persistent data storage and backup
6. **Collaboration**: Multi-user features and sharing
7. **Analytics**: Usage tracking and insights
8. **Monetization**: Subscription management and billing

This architecture ensures a smooth transition from the current client-side application to a full-stack solution while maintaining backward compatibility and user experience.