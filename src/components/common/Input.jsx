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