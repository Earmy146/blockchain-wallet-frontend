/**
 * Seed Phrase Display Component
 * File: src/components/wallet/SeedPhraseDisplay.jsx
 */

import { useState } from 'react'
import { Eye, EyeOff, AlertTriangle, Copy } from 'lucide-react'
import { copyToClipboard } from '../../utils/formatter'
import { useToast } from '../../context/ToastContext'
import clsx from 'clsx'

const SeedPhraseDisplay = ({ 
  seedPhrase, 
  showWarning = true,
  allowCopy = true,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const toast = useToast()
  
  if (!seedPhrase) return null
  
  const words = seedPhrase.split(' ')

  const handleCopy = async () => {
    const success = await copyToClipboard(seedPhrase)
    if (success) {
      toast.success('Đã sao chép seed phrase!')
    } else {
      toast.error('Không thể sao chép')
    }
  }

  return (
    <div className={className}>
      {/* Warning */}
      {showWarning && (
        <div className="mb-4 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-yellow-500 mb-1">
                ⚠️ Cảnh báo quan trọng
              </h4>
              <ul className="text-sm text-yellow-200 space-y-1">
                <li>• Đây là lần DUY NHẤT bạn thấy 12 từ này</li>
                <li>• Viết ra giấy và cất giữ cẩn thận</li>
                <li>• KHÔNG chia sẻ với bất kỳ ai</li>
                <li>• Mất seed phrase = Mất toàn bộ tài sản</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-gray-400">
          12 từ khôi phục (Seed Phrase)
        </label>
        
        <div className="flex items-center gap-2">
          {allowCopy && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          )}
          
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {isVisible ? (
              <>
                <EyeOff className="w-3 h-3" />
                Ẩn
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                Hiện
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seed Phrase Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        {words.map((word, index) => (
          <div
            key={index}
            className={clsx(
              'flex items-center gap-2 p-3 bg-gray-900 rounded-lg border border-gray-700',
              'transition-all duration-200'
            )}
          >
            <span className="text-xs text-gray-500 font-medium w-6">
              {index + 1}.
            </span>
            <span className={clsx(
              'flex-1 text-sm font-mono',
              isVisible ? 'text-gray-100' : 'text-gray-900 select-none blur-sm'
            )}>
              {word}
            </span>
          </div>
        ))}
      </div>

      {/* Helper Text */}
      <p className="mt-3 text-xs text-gray-500">
        Ghi lại 12 từ này theo đúng thứ tự. Bạn sẽ cần chúng để khôi phục ví.
      </p>
    </div>
  )
}

export default SeedPhraseDisplay