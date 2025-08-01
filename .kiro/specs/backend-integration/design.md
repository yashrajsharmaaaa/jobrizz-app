# Backend Integration Design

## Overview

This design document outlines the architecture and implementation approach for the JobRizz backend API. The backend will be built using Node.js with Express.js, TypeScript, Prisma ORM with PostgreSQL, and Redis for caching. The system will provide RESTful APIs for user authentication, resume management, AI service integration, and file processing.

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Express API   │    │   PostgreSQL    │
│                 │◄──►│                 │◄──►│   Database      │
│   (Port 5173)   │    │   (Port 3001)   │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Redis Cache   │
                       │   (Port 6379)   │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  External APIs  │
                       │  (OpenAI, etc.) │
                       └─────────────────┘
```

### Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **File Processing**: Multer, PDF-parse, Mammoth
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI

## Components and Interfaces

### 1. Authentication Module

#### JWT Service
```typescript
interface JWTService {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload | null;
  refreshToken(token: string): string;
}

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}
```

#### Auth Controller
```typescript
interface AuthController {
  register(req: RegisterRequest, res: Response): Promise<void>;
  login(req: LoginRequest, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  refreshToken(req: RefreshRequest, res: Response): Promise<void>;
}
```

### 2. User Management Module

#### User Model
```typescript
interface User {
  id: string;
  email: string;
  password: string; // hashed
  name: string;
  createdAt: Date;
  updatedAt: Date;
  resumes: Resume[];
}
```

#### User Service
```typescript
interface UserService {
  createUser(userData: CreateUserData): Promise<User>;
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
}
```

### 3. Resume Management Module

#### Resume Model
```typescript
interface Resume {
  id: string;
  userId: string;
  title: string;
  sections: ResumeSection[];
  template: Template;
  metadata: ResumeMetadata;
  createdAt: Date;
  updatedAt: Date;
}

interface ResumeSection {
  id: string;
  resumeId: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects';
  content: Record<string, any>;
  order: number;
}

interface Template {
  id: string;
  name: string;
  styles: Record<string, any>;
}

interface ResumeMetadata {
  version: number;
  lastModified: Date;
  wordCount: number;
  atsScore?: number;
}
```

#### Resume Service
```typescript
interface ResumeService {
  createResume(userId: string, resumeData: CreateResumeData): Promise<Resume>;
  getUserResumes(userId: string): Promise<Resume[]>;
  getResumeById(id: string, userId: string): Promise<Resume | null>;
  updateResume(id: string, userId: string, updates: Partial<Resume>): Promise<Resume>;
  deleteResume(id: string, userId: string): Promise<void>;
  duplicateResume(id: string, userId: string): Promise<Resume>;
}
```

### 4. AI Integration Module

#### AI Service
```typescript
interface AIService {
  analyzeResume(resumeContent: string): Promise<AIAnalysisResult>;
  correctResume(resumeContent: string): Promise<AICorrectionResult>;
  calculateATSScore(resumeContent: string): Promise<ATSScoreResult>;
  matchJobs(resumeContent: string, jobDescriptions: string[]): Promise<JobMatchResult[]>;
}

interface AIAnalysisResult {
  suggestions: Suggestion[];
  overallScore: number;
  strengths: string[];
  improvements: string[];
}

interface AICorrectionResult {
  corrections: Correction[];
  improvedContent: string;
}

interface ATSScoreResult {
  score: number;
  factors: ATSFactor[];
  recommendations: string[];
}
```

### 5. File Processing Module

#### File Upload Service
```typescript
interface FileUploadService {
  uploadFile(file: Express.Multer.File): Promise<UploadResult>;
  parseResume(filePath: string, fileType: string): Promise<ParsedResumeData>;
  validateFile(file: Express.Multer.File): boolean;
  deleteFile(filePath: string): Promise<void>;
}

interface ParsedResumeData {
  text: string;
  sections: ParsedSection[];
  metadata: FileMetadata;
}
```

### 6. Caching Module

#### Cache Service
```typescript
interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
```

## Data Models

### Database Schema (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  resumes   Resume[]

  @@map("users")
}

model Resume {
  id        String          @id @default(cuid())
  userId    String
  title     String
  template  Json
  metadata  Json
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt
  user      User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  sections  ResumeSection[]

  @@map("resumes")
}

model ResumeSection {
  id       String @id @default(cuid())
  resumeId String
  type     String
  content  Json
  order    Int
  resume   Resume @relation(fields: [resumeId], references: [id], onDelete: Cascade)

  @@map("resume_sections")
}

model Template {
  id     String @id @default(cuid())
  name   String @unique
  styles Json

  @@map("templates")
}
```

## Error Handling

### Error Types
```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
}

interface APIError {
  type: ErrorType;
  message: string;
  details?: any;
  statusCode: number;
}
```

### Error Handler Middleware
```typescript
interface ErrorHandler {
  handleError(error: Error, req: Request, res: Response, next: NextFunction): void;
  logError(error: Error, req: Request): void;
  formatErrorResponse(error: APIError): ErrorResponse;
}
```

## Testing Strategy

### Unit Testing
- Service layer testing with mocked dependencies
- Utility function testing
- Validation schema testing
- Error handling testing

### Integration Testing
- API endpoint testing with test database
- Database operation testing
- External service integration testing
- Authentication flow testing

### Test Structure
```
backend/
├── src/
└── tests/
    ├── unit/
    │   ├── services/
    │   ├── utils/
    │   └── validators/
    ├── integration/
    │   ├── auth/
    │   ├── resumes/
    │   └── ai/
    └── fixtures/
        ├── users.ts
        └── resumes.ts
```

## API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `DELETE /api/users/account` - Delete user account

### Resume Routes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/:id` - Get specific resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/duplicate` - Duplicate resume

### AI Routes
- `POST /api/ai/analyze` - Analyze resume
- `POST /api/ai/correct` - Get AI corrections
- `POST /api/ai/ats-score` - Calculate ATS score
- `POST /api/ai/job-match` - Match with job descriptions

### File Routes
- `POST /api/files/upload` - Upload resume file
- `POST /api/files/parse` - Parse uploaded resume
- `DELETE /api/files/:id` - Delete uploaded file

### Template Routes
- `GET /api/templates` - Get available templates
- `GET /api/templates/:id` - Get specific template

### Health Routes
- `GET /api/health` - Health check
- `GET /api/health/db` - Database health check
- `GET /api/health/cache` - Cache health check

## Security Considerations

### Authentication & Authorization
- JWT tokens with appropriate expiration times
- Password hashing using bcrypt
- Rate limiting on authentication endpoints
- CORS configuration for frontend domain

### Data Protection
- Input validation using Zod schemas
- SQL injection prevention through Prisma ORM
- XSS protection with proper sanitization
- File upload restrictions and validation

### API Security
- HTTPS enforcement in production
- Request size limits
- Rate limiting per user/IP
- API key protection for external services

## Performance Optimization

### Caching Strategy
- User session caching in Redis
- Resume data caching for frequently accessed resumes
- AI analysis result caching
- Template caching

### Database Optimization
- Proper indexing on frequently queried fields
- Connection pooling
- Query optimization
- Pagination for large datasets

### File Handling
- Temporary file cleanup
- File size limitations
- Asynchronous file processing
- CDN integration for file storage (future)

## Deployment Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/jobrizz
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# OpenAI
OPENAI_API_KEY=your-openai-key

# Server
PORT=3001
NODE_ENV=development

# File Upload
MAX_FILE_SIZE=10MB
UPLOAD_DIR=./uploads
```

### Docker Configuration
- Multi-stage Docker build
- Development and production containers
- Docker Compose for local development
- Health checks and proper logging

This design provides a comprehensive foundation for building a robust backend that integrates seamlessly with the existing JobRizz frontend application.