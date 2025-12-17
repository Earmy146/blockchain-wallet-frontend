/**
 * Button Component
 * File: src/components/common/Button.jsx
 */

import clsx from 'clsx'

const Button = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  type = 'button',
  onClick,
  className,
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg',
    secondary: 'bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700',
    outline: 'border border-gray-700 hover:bg-gray-800 text-gray-100',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    ghost: 'hover:bg-gray-800 text-gray-100',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  )
}

export default Button

/**
 * Card Component
 * File: src/components/common/Card.jsx
 */

import clsx from 'clsx'

const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className,
  hoverable = false,
  ...props 
}) => {
  return (
    <div 
      className={clsx(
        'bg-gray-900 rounded-xl shadow-lg border border-gray-800 p-6',
        'transition-all duration-200',
        hoverable && 'hover:shadow-xl hover:border-gray-700 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {(title || subtitle) && (
        <div className="mb-4 pb-4 border-b border-gray-800">
          {title && (
            <h3 className="text-xl font-semibold text-gray-100 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-800">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card

/**
 * Copy Button Component
 * File: src/components/common/CopyButton.jsx
 */

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { copyToClipboard } from '../../utils/formatter'
import { useToast } from '../../context/ToastContext'
import clsx from 'clsx'

const CopyButton = ({ 
  text, 
  successMessage = 'Đã sao chép!',
  size = 'md',
  variant = 'ghost',
  className 
}) => {
  const [copied, setCopied] = useState(false)
  const toast = useToast()
  
  const handleCopy = async () => {
    const success = await copyToClipboard(text)
    
    if (success) {
      setCopied(true)
      toast.success(successMessage)
      
      // Reset sau 2 giây
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } else {
      toast.error('Không thể sao chép')
    }
  }
  
  const sizes = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  }
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }
  
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={clsx(
        'inline-flex items-center justify-center rounded-lg transition-colors',
        'hover:bg-gray-800 text-gray-400 hover:text-gray-100',
        sizes[size],
        className
      )}
      title={copied ? 'Đã sao chép!' : 'Sao chép'}
    >
      {copied ? (
        <Check className={clsx(iconSizes[size], 'text-green-500')} />
      ) : (
        <Copy className={iconSizes[size]} />
      )}
    </button>
  )
}

export default CopyButton

/**
 * Input Component
 * File: src/components/common/Input.jsx
 */

import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  helperText,
  icon,
  fullWidth = true,
  className,
  ...props 
}, ref) => {
  return (
    <div className={clsx('mb-4', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full px-4 py-3 bg-gray-800 border rounded-lg text-gray-100 placeholder-gray-500',
            'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            !error && 'border-gray-700',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

/**
 * Input Component
 * File: src/components/common/Input.jsx
 */

import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({ 
  label,
  type = 'text',
  error,
  helperText,
  icon,
  fullWidth = true,
  className,
  ...props 
}, ref) => {
  return (
    <div className={clsx('mb-4', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full px-4 py-3 bg-gray-800 border rounded-lg text-gray-100 placeholder-gray-500',
            'focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            !error && 'border-gray-700',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-400">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input

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