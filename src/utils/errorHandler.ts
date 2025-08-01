/**
 * Global error handling utility
 * Provides consistent error handling across the application
 */

import { logger } from './logger';
import { config } from '../config/environment';

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  source?: string;
}

export class ErrorHandler {
  static createError(
    code: string,
    message: string,
    details?: any,
    source?: string
  ): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      source,
    };
  }

  static handleError(error: Error | AppError, source?: string): AppError {
    let appError: AppError;

    if ('code' in error && 'timestamp' in error) {
      // Already an AppError
      appError = error as AppError;
    } else {
      // Convert regular Error to AppError
      appError = this.createError(
        'UNKNOWN_ERROR',
        error.message || 'An unexpected error occurred',
        { stack: error.stack },
        source
      );
    }

    // Log the error
    logger.error(`Error in ${source || 'unknown'}`, {
      code: appError.code,
      message: appError.message,
      details: appError.details,
    });

    return appError;
  }

  static handleApiError(error: any, endpoint?: string): AppError {
    const source = `API${endpoint ? `:${endpoint}` : ''}`;
    
    if (error.response) {
      // HTTP error response
      return this.createError(
        `HTTP_${error.response.status}`,
        error.response.data?.message || `HTTP ${error.response.status} Error`,
        {
          status: error.response.status,
          data: error.response.data,
          endpoint,
        },
        source
      );
    } else if (error.request) {
      // Network error
      return this.createError(
        'NETWORK_ERROR',
        'Network connection failed',
        { endpoint },
        source
      );
    } else {
      // Other error
      return this.handleError(error, source);
    }
  }

  static handleFileError(error: any, fileName?: string): AppError {
    const source = `FILE${fileName ? `:${fileName}` : ''}`;
    
    if (error.name === 'FileSizeError') {
      return this.createError(
        'FILE_TOO_LARGE',
        `File size exceeds ${config.upload.maxFileSize / 1024 / 1024}MB limit`,
        { fileName, maxSize: config.upload.maxFileSize },
        source
      );
    } else if (error.name === 'FileTypeError') {
      return this.createError(
        'INVALID_FILE_TYPE',
        `File type not supported. Allowed types: ${config.upload.allowedTypes.join(', ')}`,
        { fileName, allowedTypes: config.upload.allowedTypes },
        source
      );
    } else {
      return this.handleError(error, source);
    }
  }

  static handleAIError(error: any, operation?: string): AppError {
    const source = `AI${operation ? `:${operation}` : ''}`;
    
    if (error.message?.includes('timeout')) {
      return this.createError(
        'AI_TIMEOUT',
        'AI processing took too long. Please try again.',
        { operation, timeout: config.ai.processingTimeout },
        source
      );
    } else if (error.message?.includes('confidence')) {
      return this.createError(
        'AI_LOW_CONFIDENCE',
        'AI analysis confidence is too low. Please try with different content.',
        { operation, threshold: config.ai.confidenceThreshold },
        source
      );
    } else {
      return this.handleError(error, source);
    }
  }

  static getUserFriendlyMessage(error: AppError): string {
    const friendlyMessages: { [key: string]: string } = {
      'NETWORK_ERROR': 'Please check your internet connection and try again.',
      'HTTP_404': 'The requested resource was not found.',
      'HTTP_500': 'Server error. Please try again later.',
      'FILE_TOO_LARGE': 'File is too large. Please choose a smaller file.',
      'INVALID_FILE_TYPE': 'File type not supported. Please upload a PDF, Word document, or text file.',
      'AI_TIMEOUT': 'Analysis is taking longer than expected. Please try again.',
      'AI_LOW_CONFIDENCE': 'Unable to analyze this content reliably. Please try with different content.',
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please wait a moment before trying again.',
    };

    return friendlyMessages[error.code] || error.message || 'An unexpected error occurred.';
  }

  static shouldRetry(error: AppError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'HTTP_500',
      'HTTP_502',
      'HTTP_503',
      'HTTP_504',
      'AI_TIMEOUT',
    ];

    return retryableCodes.includes(error.code);
  }
}

// Global error handler for unhandled errors
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    ErrorHandler.handleError(event.error, 'GLOBAL');
  });

  window.addEventListener('unhandledrejection', (event) => {
    ErrorHandler.handleError(new Error(event.reason), 'PROMISE');
  });
}

export default ErrorHandler;