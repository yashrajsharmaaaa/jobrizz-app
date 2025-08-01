import React from 'react'
import { cn } from '../lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  width, 
  height 
}) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded bg-gray-200 dark:bg-gray-700',
        className
      )}
      style={{
        width: width,
        height: height
      }}
    />
  )
}

// Pre-built skeleton components
export const SkeletonCard: React.FC = () => (
  <div className="space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-5/6" />
  </div>
)

export const SkeletonAvatar: React.FC = () => (
  <Skeleton className="h-10 w-10 rounded-full" />
)

export const SkeletonButton: React.FC = () => (
  <Skeleton className="h-10 w-24 rounded-lg" />
)

export const SkeletonInput: React.FC = () => (
  <Skeleton className="h-10 w-full rounded-lg" />
)

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton 
        key={i} 
        className="h-4" 
        width={i === lines - 1 ? '60%' : '100%'} 
      />
    ))}
  </div>
)

export default Skeleton 