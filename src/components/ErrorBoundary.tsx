import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { logger } from '../utils/logger'
import { ErrorHandler } from '../utils/errorHandler'
import { config } from '../config/environment'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  maxRetries?: number
}

interface State {
  hasError: boolean
  error?: Error
  errorId?: string
  retryCount: number
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    return { hasError: true, error, errorId }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const appError = ErrorHandler.handleError(error, 'ErrorBoundary')
    
    // Log the error with context
    logger.error('React Error Boundary caught error', {
      error: appError,
      errorInfo,
      retryCount: this.state.retryCount,
      component: errorInfo.componentStack,
    })

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // In production, send to error reporting service
    if (config.app.environment === 'production') {
      this.reportErrorToService(appError, errorInfo)
    }
  }

  private reportErrorToService = (error: any, errorInfo: ErrorInfo) => {
    // Placeholder for error reporting service integration
    logger.info('Error reported to monitoring service', { error, errorInfo })
  }

  private handleReset = () => {
    const maxRetries = this.props.maxRetries || 3
    
    if (this.state.retryCount < maxRetries) {
      logger.info('Retrying after error', { retryCount: this.state.retryCount + 1 })
      
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorId: undefined,
        retryCount: prevState.retryCount + 1
      }))
    } else {
      logger.warn('Max retries reached, forcing page reload')
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const maxRetries = this.props.maxRetries || 3

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-red-600 dark:text-red-400">
                Oops! Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                We encountered an unexpected error. Don't worry, we're on it!
              </p>

              {/* Error Details (only in development) */}
              {config.debug.enabled && this.state.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Error Details (Development)
                  </h4>
                  <p className="text-xs text-red-700 font-mono break-all">
                    {this.state.error.message}
                  </p>
                  {this.state.errorId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Error ID: {this.state.errorId}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col space-y-2">
                {this.state.retryCount < maxRetries ? (
                  <Button onClick={this.handleReset} className="w-full">
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Try Again {this.state.retryCount > 0 && `(${this.state.retryCount}/${maxRetries})`}
                  </Button>
                ) : (
                  <Button onClick={() => window.location.reload()} className="w-full">
                    <ArrowPathIcon className="w-4 h-4 mr-2" />
                    Reload Page
                  </Button>
                )}
                
                <Button 
                  onClick={() => window.history.back()} 
                  variant="outline" 
                  className="w-full"
                >
                  Go Back
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  If this problem persists, please{' '}
                  <a 
                    href="mailto:support@jobrizz.com" 
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    contact support
                  </a>
                  {config.debug.enabled && this.state.errorId && (
                    <span> and include Error ID: {this.state.errorId}</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized Error Boundaries for different parts of the app

export const AIErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-900 mb-2">AI Service Error</h3>
        <p className="text-red-700 mb-4">
          Our AI analysis encountered an issue. This might be temporary.
        </p>
        <Button onClick={() => window.location.reload()} size="sm">
          Retry Analysis
        </Button>
      </div>
    }
    onError={(error) => logger.error('AI component error', { error })}
    maxRetries={2}
  >
    {children}
  </ErrorBoundary>
)

export const FileUploadErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary
    fallback={
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-yellow-900 mb-2">Upload Error</h3>
        <p className="text-yellow-700 mb-4">
          There was an issue with the file upload. Please try again.
        </p>
        <Button onClick={() => window.location.reload()} size="sm" variant="outline">
          Try Upload Again
        </Button>
      </div>
    }
    onError={(error) => logger.error('File upload error', { error })}
    maxRetries={2}
  >
    {children}
  </ErrorBoundary>
)

export default ErrorBoundary 