# JobRizz - AI-Powered Resume Builder & Analysis Platform

## Project Overview
A frontend-focused TypeScript React application for resume building, AI-powered analysis, and job matching. Built with React 19, TypeScript, and Vite, featuring drag-and-drop resume editing, AI recommendations, and PDF export capabilities.

## Architecture

### Frontend (React + TypeScript + Vite)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Context API
- **PDF Generation**: jsPDF with PDF.js worker
- **Document Processing**: Mammoth.js for DOCX, PDF-parse for PDF files
- **UI Components**: Custom component library with Headless UI patterns
- **Drag & Drop**: React DnD with HTML5 and touch backends
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router DOM

## Key Features

### 1. Resume Builder
- **Drag & Drop Editor**: Custom drag-and-drop interface for resume sections
- **Template System**: Multiple resume templates with customization
- **Real-time Preview**: Live preview of resume changes
- **PDF Export**: Generate downloadable PDF resumes

### 2. AI-Powered Analysis
- **Resume Corrector**: AI suggestions for grammar, formatting, and content
- **ATS Score**: Applicant Tracking System compatibility scoring
- **AI Recommendations**: Content and structure suggestions
- **Job Matching**: AI-powered job description matching

### 3. Authentication & User Management
- **JWT Authentication**: Secure user sessions
- **User Profiles**: Personal data management
- **Resume Storage**: Save and manage multiple resumes

## Directory Structure

### Frontend (`src/`)
```
src/
├── components/           # Reusable UI components
│   ├── analysis/        # AI analysis components
│   ├── job-matching/    # Job matching features
│   ├── resume-builder/  # Resume editor components
│   ├── ui/             # Base UI components
│   └── upload/         # File upload components
├── pages/              # Route components
├── services/           # API and external service integrations
├── contexts/           # React context providers
├── types/              # TypeScript type definitions
├── lib/                # Utility libraries
├── config/             # Configuration files
└── utils/              # Helper utilities
```

## Key Components

### Resume Builder Components
- **DragDropResumeEditor**: Main drag-and-drop interface
- **TemplateSelector**: Choose from available templates
- **TemplateCustomizer**: Customize template styling
- **TemplatePreview**: Live preview of resume

### AI Analysis Components
- **AIResumeCorrector**: Grammar and content suggestions
- **ATSScoreCard**: ATS compatibility scoring
- **AIRecommendations**: AI-powered recommendations
- **AIInsights**: Job matching insights

### Core Services
- **apiClient**: HTTP client for backend communication
- **aiService**: AI/ML service integrations
- **pdfExport**: PDF generation utilities
- **resumeParser**: Resume parsing and processing

## Data Models

### Resume Structure
```typescript
interface Resume {
  id: string;
  userId: string;
  title: string;
  sections: ResumeSection[];
  template: Template;
  metadata: ResumeMetadata;
}

interface ResumeSection {
  id: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'projects';
  content: any;
  order: number;
}
```

### User & Authentication
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  resumes: Resume[];
}

interface AuthContext {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
```

## API Integration

The frontend integrates with external services through:

### AI Services
- **OpenAI API**: For resume analysis and corrections
- **Custom AI algorithms**: ATS scoring and job matching
- **Document processing**: PDF and DOCX parsing

### Data Storage
- **Local Storage**: User preferences and temporary data
- **Session Storage**: Authentication tokens and session data
- **File System**: Resume templates and exported PDFs

## Development Setup

### Frontend
```bash
npm install
npm run dev
```

### Build Commands
```bash
npm run build          # Production build
npm run build:staging  # Staging build
npm run preview        # Preview production build
npm run lint           # Run ESLint
npm run type-check     # TypeScript type checking
```

## Key Technologies

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with custom design system
- **Headless UI** for accessible components
- **React Hook Form** with Zod validation
- **React Router DOM** for routing
- **React DnD** for drag-and-drop functionality

### Document Processing
- **jsPDF** for PDF generation
- **PDF.js** for PDF parsing
- **Mammoth.js** for DOCX processing
- **DOMPurify** for HTML sanitization

### Development Tools
- **TypeScript** with strict mode
- **ESLint** for code linting
- **PostCSS** with Autoprefixer
- **Class Variance Authority** for component variants

## State Management

### Context Providers
- **AuthContext**: User authentication state
- **DarkModeContext**: Theme management
- **DragDropProvider**: Drag-and-drop state

### Local State
- React hooks for component-specific state
- Form state management with React Hook Form
- File upload state management

## Styling & UI

### Design System
- Tailwind CSS for utility-first styling
- Custom component library with consistent design
- Dark/light mode support
- Responsive design patterns

### Key UI Components
- **Button**: Consistent button styling
- **Card**: Content containers
- **Input**: Form inputs with validation
- **Toast**: Notification system
- **LoadingSpinner**: Loading states
- **Skeleton**: Loading placeholders

## Testing Strategy

### Frontend Testing
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for user flows
- Type checking with TypeScript
- Linting with ESLint

## Deployment

### Frontend
- Vite build for production
- Static file hosting (Vercel, Netlify, etc.)
- Environment-based configuration (.env files)
- PDF worker file copying for production builds
- Bundle analysis and optimization

## Common Patterns

### Error Handling
- Centralized error boundaries
- API error handling with toast notifications
- Validation error display
- Graceful degradation

### Performance
- Lazy loading for components
- Image optimization
- PDF worker optimization
- Caching strategies

### Security
- Input validation with Zod
- HTML sanitization with DOMPurify
- Secure file handling for uploads
- Environment variable protection

## Development Workflow

### Code Organization
- Feature-based component organization
- Shared utilities and types
- Consistent naming conventions
- TypeScript strict mode

### Git Workflow
- Feature branch development
- Pull request reviews
- Conventional commit messages
- Automated testing

This context provides a comprehensive overview of the MARK 1 project structure, architecture, and key components to help AI assistants understand the codebase quickly and provide relevant assistance. 