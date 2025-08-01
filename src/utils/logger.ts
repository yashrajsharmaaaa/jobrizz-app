/**
 * Production-ready logging utility
 * Handles different log levels and environments
 */

import { config, shouldLog } from '../config/environment';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  source?: string;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      source,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return shouldLog(level);
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, data, source);
    
    // In production, you might want to send logs to a service
    if (config.app.environment === 'production') {
      // Send to logging service (e.g., Sentry, LogRocket, etc.)
      this.sendToLoggingService(logEntry);
    }

    // Console logging with appropriate method
    switch (level) {
      case 'debug':
        console.debug(`[DEBUG] ${message}`, data || '');
        break;
      case 'info':
        console.info(`[INFO] ${message}`, data || '');
        break;
      case 'warn':
        console.warn(`[WARN] ${message}`, data || '');
        break;
      case 'error':
        console.error(`[ERROR] ${message}`, data || '');
        break;
    }
  }

  private sendToLoggingService(logEntry: LogEntry): void {
    // Placeholder for production logging service integration
    // Example: Sentry, LogRocket, DataDog, etc.
    if (logEntry.level === 'error') {
      // Send errors to error tracking service
    }
  }

  debug(message: string, data?: any, source?: string): void {
    this.log('debug', message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.log('info', message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.log('warn', message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.log('error', message, data, source);
  }

  // Specialized logging methods
  apiCall(method: string, url: string, status?: number, duration?: number): void {
    this.info(`API ${method} ${url}`, {
      method,
      url,
      status,
      duration: duration ? `${duration}ms` : undefined,
    }, 'API');
  }

  userAction(action: string, data?: any): void {
    this.info(`User action: ${action}`, data, 'USER');
  }

  performance(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric}`, { value, unit }, 'PERFORMANCE');
  }

  aiOperation(operation: string, duration?: number, confidence?: number): void {
    this.info(`AI Operation: ${operation}`, {
      duration: duration ? `${duration}ms` : undefined,
      confidence: confidence ? `${Math.round(confidence * 100)}%` : undefined,
    }, 'AI');
  }
}

// Export singleton instance
export const logger = new Logger();

// Export for easy access
export default logger;