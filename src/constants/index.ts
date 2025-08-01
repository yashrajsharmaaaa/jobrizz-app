/**
 * Application Constants
 * Centralized constants for the entire application
 */

import { config } from '../config/environment';

// Application Information
export const APP_INFO = {
  NAME: config.app.name,
  VERSION: config.app.version,
  DESCRIPTION: config.app.description,
  URL: config.app.url,
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  BASE: config.api.baseUrl,
  RESUME_ANALYSIS: '/resume/analyze',
  JOB_MATCHING: '/job/match',
  FILE_UPLOAD: '/upload',
  HEALTH: '/health',
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: config.upload.maxFileSize,
  MAX_SIZE_MB: Math.round(config.upload.maxFileSize / 1024 / 1024),
  ALLOWED_TYPES: ['.txt', '.pdf', '.doc', '.docx'],
  TIMEOUT: config.upload.timeout,
  CHUNK_SIZE: 1024 * 1024, // 1MB chunks
} as const;

// AI Service Constants
export const AI_SERVICE = {
  ENABLED: config.ai.enabled,
  TIMEOUT: config.ai.processingTimeout,
  CONFIDENCE_THRESHOLD: config.ai.confidenceThreshold,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

// ATS Scoring Constants
export const ATS_SCORING = {
  EXCELLENT_THRESHOLD: 80,
  GOOD_THRESHOLD: 60,
  FAIR_THRESHOLD: 40,
  MAX_SCORE: 100,
  MIN_SCORE: 0,
} as const;

// Job Matching Constants
export const JOB_MATCHING = {
  MIN_MATCH_SCORE: 30,
  GOOD_MATCH_THRESHOLD: 70,
  EXCELLENT_MATCH_THRESHOLD: 85,
  MAX_KEYWORDS: 50,
  MAX_SKILLS_GAP: 20,
} as const;

// UI Constants
export const UI = {
  ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 500,
  TOAST_DURATION: 5000,
  LOADING_MIN_DURATION: 1000,
  SKELETON_ITEMS: 3,
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_JOB_DESCRIPTION_LENGTH: 100,
  MAX_JOB_DESCRIPTION_LENGTH: 10000,
  MIN_RESUME_WORDS: 50,
  MAX_RESUME_WORDS: 2000,
  MIN_COMPANY_NAME_LENGTH: 2,
  MAX_COMPANY_NAME_LENGTH: 100,
  MIN_JOB_TITLE_LENGTH: 2,
  MAX_JOB_TITLE_LENGTH: 100,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection and try again.',
  FILE_TOO_LARGE: `File size must be less than ${FILE_UPLOAD.MAX_SIZE_MB}MB.`,
  INVALID_FILE_TYPE: 'Please upload a supported file type: .txt, .pdf, .doc, or .docx',
  AI_TIMEOUT: 'Analysis is taking longer than expected. Please try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  RATE_LIMIT: 'Too many requests. Please wait a moment before trying again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  FILE_UPLOADED: 'File uploaded successfully!',
  ANALYSIS_COMPLETE: 'Analysis completed successfully!',
  JOB_MATCH_COMPLETE: 'Job matching analysis completed!',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'jobrizz_theme',
  USER_PREFERENCES: 'jobrizz_user_preferences',
  RECENT_ANALYSES: 'jobrizz_recent_analyses',
  FEATURE_FLAGS: 'jobrizz_feature_flags',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ANALYSIS: '/analysis',
  JOB_MATCHING: '/job-matching',
  EDITOR: '/editor',
  WORK_IN_PROGRESS: '/work-in-progress',
  TEMPLATES: '/templates',
  DRAG_DROP: '/drag-drop',
} as const;

// Feature Flags
export const FEATURES = {
  RESUME_BUILDER: config.features.resumeBuilder,
  AI_RECOMMENDATIONS: config.features.aiRecommendations,
  JOB_MATCHING: config.features.jobMatching,
  DARK_MODE: config.features.darkMode,
} as const;

// Analytics Events
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  FILE_UPLOAD: 'file_upload',
  ANALYSIS_START: 'analysis_start',
  ANALYSIS_COMPLETE: 'analysis_complete',
  JOB_MATCH_START: 'job_match_start',
  JOB_MATCH_COMPLETE: 'job_match_complete',
  ERROR_OCCURRED: 'error_occurred',
  FEATURE_USED: 'feature_used',
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  ENABLED: config.security.rateLimitEnabled,
  REQUESTS: config.security.rateLimitRequests,
  WINDOW: config.security.rateLimitWindow,
  STORAGE_KEY: 'jobrizz_rate_limit',
} as const;

// Export all constants
export default {
  APP_INFO,
  API_ENDPOINTS,
  FILE_UPLOAD,
  AI_SERVICE,
  ATS_SCORING,
  JOB_MATCHING,
  UI,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  FEATURES,
  ANALYTICS_EVENTS,
  RATE_LIMITS,
} as const;