/**
 * Loading Component
 * File: src/components/common/Loading.jsx
 */

import clsx from 'clsx'

const Loading = ({ 
  size = 'md', 
  text,
  fullScreen = false,
  className 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }
  
  const spinner = (
    <div className={clsx('flex flex-col items-center justify-center gap-4', className)}>
      <div className={clsx(
        'animate-spin rounded-full border-4 border-gray-700 border-t-primary-500',
        sizes[size]
      )} />
      {text && (
        <p className="text-gray-400 text-sm">{text}</p>
      )}
    </div>
  )
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }
  
  return spinner
}

/**
 * Loading Skeleton Component
 */
export const LoadingSkeleton = ({ className, width, height }) => {
  return (
    <div 
      className={clsx(
        'animate-pulse bg-gray-800 rounded',
        className
      )}
      style={{ width, height }}
    />
  )
}

/**
 * Loading Dots Component
 */
export const LoadingDots = () => {
  return (
    <div className="flex gap-1">
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  )
}

export default Loading