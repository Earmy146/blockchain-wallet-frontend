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