// Error Types and Interfaces
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: Date;
  stack?: string;
}

export interface ValidationErrorData {
  readonly field: string;
  message: string;
  type: ValidationErrorType;
  value?: any;
}

export type ValidationErrorType = 
  | 'required'
  | 'format'
  | 'length'
  | 'range'
  | 'pattern'
  | 'custom'
  | 'unknown';

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrorData[];
  warnings: ValidationWarning[];
  sanitizedContent?: string;
}

// Resume Builder Specific Errors
export class ResumeBuilderError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, any>;
  public readonly timestamp: Date;

  constructor(code: string, message: string, details?: Record<string, any>) {
    super(message);
    this.name = 'ResumeBuilderError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

export class ValidationError extends ResumeBuilderError {
  public readonly field: string;
  public readonly validationType: ValidationErrorType;

  constructor(field: string, message: string, type: ValidationErrorType = 'custom', details?: Record<string, any>) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
    this.field = field;
    this.validationType = type;
  }
}

export class ExportError extends ResumeBuilderError {
  public readonly format: string;
  public readonly stage: 'preparation' | 'generation' | 'download';

  constructor(format: string, stage: string, message: string, details?: Record<string, any>) {
    super('EXPORT_ERROR', message, details);
    this.name = 'ExportError';
    this.format = format;
    this.stage = stage as 'preparation' | 'generation' | 'download';
  }
}

export class StorageError extends ResumeBuilderError {
  public readonly operation: 'save' | 'load' | 'delete' | 'clear';

  constructor(operation: string, message: string, details?: Record<string, any>) {
    super('STORAGE_ERROR', message, details);
    this.name = 'StorageError';
    this.operation = operation as 'save' | 'load' | 'delete' | 'clear';
  }
}

export class TemplateError extends ResumeBuilderError {
  public readonly templateId: string;
  public readonly operation: 'load' | 'render' | 'customize';

  constructor(templateId: string, operation: string, message: string, details?: Record<string, any>) {
    super('TEMPLATE_ERROR', message, details);
    this.name = 'TemplateError';
    this.templateId = templateId;
    this.operation = operation as 'load' | 'render' | 'customize';
  }
}

// Error Recovery Types
export interface ErrorRecoveryAction {
  type: 'retry' | 'fallback' | 'ignore' | 'reload' | 'reset';
  label: string;
  description?: string;
  handler: () => void | Promise<void>;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  recoveryActions?: ErrorRecoveryAction[];
}

export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  resumeId?: string;
}

// Error Reporting Types
export interface ErrorReport {
  error: AppError;
  context: ErrorContext;
  userActions: UserAction[];
  systemInfo: SystemInfo;
}

export interface ErrorContext {
  component?: string;
  route?: string;
  resumeId?: string;
  templateId?: string;
  sectionId?: string;
  operation?: string;
  userInput?: Record<string, any>;
}

export interface UserAction {
  type: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface SystemInfo {
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  timestamp: Date;
  url: string;
  referrer?: string;
  localStorage: {
    available: boolean;
    usage?: number;
    quota?: number;
  };
  memory?: {
    used: number;
    total: number;
  };
}

// Error Handler Configuration
export interface ErrorHandlerConfig {
  enableReporting: boolean;
  enableRecovery: boolean;
  enableLogging: boolean;
  maxRetries: number;
  retryDelay: number;
  fallbackTemplate?: string;
  reportingEndpoint?: string;
}

// Common Error Codes
export const ERROR_CODES = {
  // Validation Errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  CONTENT_TOO_LONG: 'CONTENT_TOO_LONG',
  CONTENT_TOO_SHORT: 'CONTENT_TOO_SHORT',
  
  // Storage Errors
  STORAGE_UNAVAILABLE: 'STORAGE_UNAVAILABLE',
  STORAGE_QUOTA_EXCEEDED: 'STORAGE_QUOTA_EXCEEDED',
  SAVE_FAILED: 'SAVE_FAILED',
  LOAD_FAILED: 'LOAD_FAILED',
  
  // Export Errors
  EXPORT_FAILED: 'EXPORT_FAILED',
  PDF_GENERATION_FAILED: 'PDF_GENERATION_FAILED',
  DOCX_GENERATION_FAILED: 'DOCX_GENERATION_FAILED',
  DOWNLOAD_FAILED: 'DOWNLOAD_FAILED',
  
  // Template Errors
  TEMPLATE_NOT_FOUND: 'TEMPLATE_NOT_FOUND',
  TEMPLATE_LOAD_FAILED: 'TEMPLATE_LOAD_FAILED',
  TEMPLATE_RENDER_FAILED: 'TEMPLATE_RENDER_FAILED',
  TEMPLATE_CUSTOMIZATION_FAILED: 'TEMPLATE_CUSTOMIZATION_FAILED',
  
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // System Errors
  MEMORY_ERROR: 'MEMORY_ERROR',
  BROWSER_NOT_SUPPORTED: 'BROWSER_NOT_SUPPORTED',
  FEATURE_NOT_SUPPORTED: 'FEATURE_NOT_SUPPORTED',
  
  // User Errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // Unknown Errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// Error Messages
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.VALIDATION_FAILED]: 'Please check your input and try again',
  [ERROR_CODES.REQUIRED_FIELD_MISSING]: 'This field is required',
  [ERROR_CODES.INVALID_FORMAT]: 'Please enter a valid format',
  [ERROR_CODES.CONTENT_TOO_LONG]: 'Content is too long',
  [ERROR_CODES.CONTENT_TOO_SHORT]: 'Content is too short',
  
  [ERROR_CODES.STORAGE_UNAVAILABLE]: 'Local storage is not available',
  [ERROR_CODES.STORAGE_QUOTA_EXCEEDED]: 'Storage quota exceeded',
  [ERROR_CODES.SAVE_FAILED]: 'Failed to save your resume',
  [ERROR_CODES.LOAD_FAILED]: 'Failed to load your resume',
  
  [ERROR_CODES.EXPORT_FAILED]: 'Failed to export your resume',
  [ERROR_CODES.PDF_GENERATION_FAILED]: 'Failed to generate PDF',
  [ERROR_CODES.DOCX_GENERATION_FAILED]: 'Failed to generate Word document',
  [ERROR_CODES.DOWNLOAD_FAILED]: 'Failed to download file',
  
  [ERROR_CODES.TEMPLATE_NOT_FOUND]: 'Template not found',
  [ERROR_CODES.TEMPLATE_LOAD_FAILED]: 'Failed to load template',
  [ERROR_CODES.TEMPLATE_RENDER_FAILED]: 'Failed to render template',
  [ERROR_CODES.TEMPLATE_CUSTOMIZATION_FAILED]: 'Failed to customize template',
  
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection error',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out',
  
  [ERROR_CODES.MEMORY_ERROR]: 'Insufficient memory',
  [ERROR_CODES.BROWSER_NOT_SUPPORTED]: 'Browser not supported',
  [ERROR_CODES.FEATURE_NOT_SUPPORTED]: 'Feature not supported',
  
  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action',
  [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred',
};

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Error Categories
export enum ErrorCategory {
  VALIDATION = 'validation',
  STORAGE = 'storage',
  EXPORT = 'export',
  TEMPLATE = 'template',
  NETWORK = 'network',
  SYSTEM = 'system',
  USER = 'user',
  UNKNOWN = 'unknown',
}