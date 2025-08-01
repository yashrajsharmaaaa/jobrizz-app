/// <reference types="vite/client" />

interface ImportMetaEnv {
  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_NODE_ENV: string
  readonly VITE_APP_URL: string

  // API Configuration
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string

  // AI Service Configuration
  readonly VITE_AI_SERVICE_ENABLED: string
  readonly VITE_AI_PROCESSING_TIMEOUT: string
  readonly VITE_AI_CONFIDENCE_THRESHOLD: string

  // File Upload Configuration
  readonly VITE_MAX_FILE_SIZE: string
  readonly VITE_ALLOWED_FILE_TYPES: string
  readonly VITE_UPLOAD_TIMEOUT: string

  // Analytics
  readonly VITE_ANALYTICS_ENABLED: string
  readonly VITE_ANALYTICS_ID: string

  // Feature Flags
  readonly VITE_FEATURE_RESUME_BUILDER: string
  readonly VITE_FEATURE_AI_RECOMMENDATIONS: string
  readonly VITE_FEATURE_JOB_MATCHING: string
  readonly VITE_FEATURE_DARK_MODE: string

  // Security
  readonly VITE_RATE_LIMIT_ENABLED: string
  readonly VITE_RATE_LIMIT_REQUESTS: string
  readonly VITE_RATE_LIMIT_WINDOW: string

  // Debug
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}