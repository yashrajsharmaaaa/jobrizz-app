/**
 * API Configuration for Backend Integration
 * This file will contain all API endpoints and configuration for the full-stack application
 */

// Environment-based API configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
  },

  // Resume Management
  RESUME: {
    UPLOAD: '/api/resume/upload',
    ANALYZE: '/api/resume/analyze',
    LIST: '/api/resume/list',
    GET: '/api/resume/:id',
    UPDATE: '/api/resume/:id',
    DELETE: '/api/resume/:id',
    DUPLICATE: '/api/resume/:id/duplicate',
  },

  // PDF Export
  EXPORT: {
    PDF: '/api/resume/export/pdf',
    DOCX: '/api/resume/export/docx',
    STATUS: '/api/resume/export/status/:id',
    DOWNLOAD: '/api/resume/download/:id',
  },

  // AI Services
  AI: {
    ANALYZE: '/api/ai/analyze',
    CORRECT: '/api/ai/correct',
    RECOMMENDATIONS: '/api/ai/recommendations',
    JOB_MATCH: '/api/ai/job-match',
  },

  // Templates
  TEMPLATES: {
    LIST: '/api/templates',
    GET: '/api/templates/:id',
    PREVIEW: '/api/templates/:id/preview',
  },

  // User Data
  USER: {
    SETTINGS: '/api/user/settings',
    PREFERENCES: '/api/user/preferences',
    USAGE: '/api/user/usage',
  },

  // System
  HEALTH: '/api/health',
  VERSION: '/api/version',
};

// Request/Response Types for Backend Integration
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Error Types
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Resume Types for Backend
export interface ResumeDocument {
  id: string;
  userId: string;
  fileName: string;
  originalContent: string;
  correctedContent?: string;
  analysis?: any; // Will be typed properly when backend is ready
  templateId?: string;
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// Export Types for Backend
export interface ExportJob {
  id: string;
  userId: string;
  resumeId: string;
  format: 'pdf' | 'docx';
  version: 'original' | 'corrected';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
  createdAt: string;
}

// Feature Flags for Progressive Enhancement
export const FEATURE_FLAGS = {
  SERVER_SIDE_EXPORT: false, // Enable when backend is ready
  REAL_TIME_ANALYSIS: false, // Enable for WebSocket-based real-time analysis
  ADVANCED_TEMPLATES: false, // Enable when template system is ready
  COLLABORATION: false, // Enable for team features
  ANALYTICS: false, // Enable for usage analytics
};

// Client-side fallback configuration
export const FALLBACK_CONFIG = {
  USE_LOCAL_STORAGE: true, // Store data locally when server is unavailable
  OFFLINE_MODE: true, // Enable offline functionality
  SYNC_ON_RECONNECT: true, // Sync data when connection is restored
};