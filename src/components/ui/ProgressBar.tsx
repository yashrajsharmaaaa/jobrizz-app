import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  label,
  className = '',
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          {showLabel && (
            <span className="text-sm text-gray-500">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={clsx(
        'w-full bg-gray-200 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[color],
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Specialized progress components
export const FileUploadProgress: React.FC<{
  progress: number;
  fileName?: string;
  className?: string;
}> = ({ progress, fileName, className = '' }) => (
  <div className={clsx('bg-white border border-gray-200 rounded-lg p-4', className)}>
    <div className="flex items-center space-x-3 mb-3">
      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {fileName || 'Uploading file...'}
        </p>
        <p className="text-xs text-gray-500">
          {progress < 100 ? 'Uploading...' : 'Upload complete'}
        </p>
      </div>
    </div>
    
    <ProgressBar
      value={progress}
      size="sm"
      color={progress === 100 ? 'success' : 'primary'}
      showLabel
      animated={progress < 100}
    />
  </div>
);

export const AnalysisProgress: React.FC<{
  stage: string;
  progress: number;
  className?: string;
}> = ({ stage, progress, className = '' }) => (
  <div className={clsx('bg-white border border-gray-200 rounded-lg p-6', className)}>
    <div className="text-center mb-6">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Analyzing Your Resume
      </h3>
      <p className="text-sm text-gray-600">
        {stage}
      </p>
    </div>
    
    <ProgressBar
      value={progress}
      size="md"
      color="primary"
      showLabel
      animated
    />
    
    <div className="mt-4 text-center">
      <p className="text-xs text-gray-500">
        This usually takes 10-30 seconds
      </p>
    </div>
  </div>
);

export default ProgressBar;