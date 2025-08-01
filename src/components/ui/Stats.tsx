import React from 'react'
import { Card, CardContent } from './Card'
import { cn } from '../../lib/utils'

interface StatItem {
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease'
  }
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

interface StatsProps {
  items: StatItem[]
  className?: string
}

const Stats: React.FC<StatsProps> = ({ items, className }) => {
  const getColorClasses = (color?: StatItem['color']) => {
    switch (color) {
      case 'success':
        return 'text-green-600 dark:text-green-400'
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'danger':
        return 'text-red-600 dark:text-red-400'
      case 'info':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-primary-600 dark:text-primary-400'
    }
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6', className)}>
      {items.map((item, index) => (
        <Card key={index} variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {item.icon && (
                  <div className="mr-3 text-2xl">
                    {item.icon}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {item.label}
                  </p>
                  <p className={cn('text-2xl font-bold', getColorClasses(item.color))}>
                    {item.value}
                  </p>
                </div>
              </div>
              {item.change && (
                <div className="text-right">
                  <div className={cn(
                    'text-sm font-medium',
                    item.change.type === 'increase' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  )}>
                    {item.change.type === 'increase' ? '+' : '-'}{Math.abs(item.change.value)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    vs last month
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export { Stats }
export type { StatItem } 