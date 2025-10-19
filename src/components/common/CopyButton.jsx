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