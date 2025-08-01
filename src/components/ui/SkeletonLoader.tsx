import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-20',
    circular: 'rounded-full',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={clsx(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 ? 'w-3/4' : 'w-full',
              index > 0 && 'mt-2'
            )}
            style={index === 0 ? style : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
};

// Pre-built skeleton components for common use cases
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={clsx('bg-white rounded-lg border border-gray-200 p-6', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1">
        <Skeleton width="60%" />
        <Skeleton width="40%" className="mt-2" />
      </div>
    </div>
    <Skeleton lines={3} />
  </div>
);

export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className = '' 
}) => (
  <div className={clsx('space-y-4', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        <Skeleton variant="circular" width={32} height={32} />
        <div className="flex-1">
          <Skeleton width="70%" />
          <Skeleton width="50%" className="mt-2" />
        </div>
        <Skeleton width={80} height={32} />
      </div>
    ))}
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number; cols?: number; className?: string }> = ({ 
  rows = 5, 
  cols = 4, 
  className = '' 
}) => (
  <div className={clsx('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
    {/* Header */}
    <div className="border-b border-gray-200 p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, index) => (
          <Skeleton key={index} width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b border-gray-100 p-4 last:border-b-0">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} width={colIndex === 0 ? '90%' : '70%'} />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const AnalysisSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={clsx('space-y-6', className)}>
    {/* Score Card Skeleton */}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton width={200} height={24} />
          <Skeleton width={300} className="mt-2" />
        </div>
        <Skeleton variant="circular" width={80} height={80} />
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <Skeleton width={120} />
            <div className="flex items-center space-x-3">
              <Skeleton width={128} height={8} />
              <Skeleton width={24} />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recommendations Skeleton */}
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Skeleton variant="circular" width={32} height={32} />
        <div>
          <Skeleton width={200} />
          <Skeleton width={250} className="mt-1" />
        </div>
      </div>
      
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1">
                <Skeleton variant="circular" width={20} height={20} />
                <div className="flex-1">
                  <Skeleton width="60%" />
                  <Skeleton width="80%" className="mt-1" />
                </div>
              </div>
              <div className="space-y-1">
                <Skeleton width={80} height={20} />
                <Skeleton width={60} height={16} />
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
              <Skeleton width="40%" className="mb-1" />
              <Skeleton width="90%" />
            </div>
            <div>
              <Skeleton width="30%" className="mb-2" />
              <div className="space-y-1">
                <Skeleton width="95%" />
                <Skeleton width="85%" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Skeleton;