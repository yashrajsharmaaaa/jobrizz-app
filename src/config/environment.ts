/**
 * Environment Configuration
 * Centralized configuration management for different environments
 */

export interface AppConfig {
    app: {
        name: string;
        version: string;
        description: string;
        url: string;
        environment: 'development' | 'production' | 'staging';
    };
    api: {
        baseUrl: string;
        timeout: number;
    };
    ai: {
        enabled: boolean;
        processingTimeout: number;
        confidenceThreshold: number;
    };
    upload: {
        maxFileSize: number;
        allowedTypes: string[];
        timeout: number;
    };
    features: {
        resumeBuilder: boolean;
        aiRecommendations: boolean;
        jobMatching: boolean;
        darkMode: boolean;
    };
    security: {
        rateLimitEnabled: boolean;
        rateLimitRequests: number;
        rateLimitWindow: number;
    };
    analytics: {
        enabled: boolean;
        id?: string;
    };
    debug: {
        enabled: boolean;
        logLevel: 'debug' | 'info' | 'warn' | 'error';
    };
}

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
    return import.meta.env[key as keyof ImportMetaEnv] || fallback;
};

// Helper function to get boolean environment variable
const getEnvBool = (key: string, fallback: boolean = false): boolean => {
    const value = getEnvVar(key);
    return value === 'true' || (value === '' && fallback);
};

// Helper function to get number environment variable
const getEnvNumber = (key: string, fallback: number = 0): number => {
    const value = getEnvVar(key);
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? fallback : parsed;
};

// Main configuration object
export const config: AppConfig = {
    app: {
        name: getEnvVar('VITE_APP_NAME', 'JobRizz'),
        version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
        description: getEnvVar('VITE_APP_DESCRIPTION', 'AI-Powered Resume Analysis Platform'),
        url: getEnvVar('VITE_APP_URL', 'http://localhost:5173'),
        environment: (getEnvVar('VITE_NODE_ENV', 'development') as AppConfig['app']['environment']),
    },
    api: {
        baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3001/api'),
        timeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
    },
    ai: {
        enabled: getEnvBool('VITE_AI_SERVICE_ENABLED', true),
        processingTimeout: getEnvNumber('VITE_AI_PROCESSING_TIMEOUT', 10000),
        confidenceThreshold: parseFloat(getEnvVar('VITE_AI_CONFIDENCE_THRESHOLD', '0.7')),
    },
    upload: {
        maxFileSize: getEnvNumber('VITE_MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB
        allowedTypes: getEnvVar('VITE_ALLOWED_FILE_TYPES', '.pdf,.doc,.docx,.txt').split(','),
        timeout: getEnvNumber('VITE_UPLOAD_TIMEOUT', 60000),
    },
    features: {
        resumeBuilder: getEnvBool('VITE_FEATURE_RESUME_BUILDER', false),
        aiRecommendations: getEnvBool('VITE_FEATURE_AI_RECOMMENDATIONS', true),
        jobMatching: getEnvBool('VITE_FEATURE_JOB_MATCHING', true),
        darkMode: getEnvBool('VITE_FEATURE_DARK_MODE', true),
    },
    security: {
        rateLimitEnabled: getEnvBool('VITE_RATE_LIMIT_ENABLED', true),
        rateLimitRequests: getEnvNumber('VITE_RATE_LIMIT_REQUESTS', 100),
        rateLimitWindow: getEnvNumber('VITE_RATE_LIMIT_WINDOW', 15 * 60 * 1000), // 15 minutes
    },
    analytics: {
        enabled: getEnvBool('VITE_ANALYTICS_ENABLED', false),
        id: getEnvVar('VITE_ANALYTICS_ID'),
    },
    debug: {
        enabled: getEnvBool('VITE_DEBUG_MODE', false),
        logLevel: (getEnvVar('VITE_LOG_LEVEL', 'info') as AppConfig['debug']['logLevel']),
    },
};

// Environment-specific configurations
export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isStaging = config.app.environment === 'staging';

// Feature flags helper
export const isFeatureEnabled = (feature: keyof AppConfig['features']): boolean => {
    return config.features[feature];
};

// Debug helper
export const shouldLog = (level: AppConfig['debug']['logLevel']): boolean => {
    if (!config.debug.enabled) return false;

    const levels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(config.debug.logLevel);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
};

// Export for easy access
export default config;