/**
 * Address Display Component
 * File: src/components/wallet/AddressDisplay.jsx
 */

import { ExternalLink } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { formatAddress, getExplorerAddressUrl } from '../../utils/formatter'
import CopyButton from '../common/CopyButton'

const AddressDisplay = ({ 
  showFull = false, 
  showExplorer = true,
  className 
}) => {
  const { walletAddress, network } = useWallet()

  if (!walletAddress) return null

  const explorerUrl = getExplorerAddressUrl(walletAddress, network)

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Địa chỉ ví của bạn
      </label>
      
      <div className="flex items-center gap-2 p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <code className="flex-1 text-sm text-gray-100 font-mono break-all">
          {showFull ? walletAddress : formatAddress(walletAddress, 10, 8)}
        </code>
        
        <div className="flex items-center gap-1">
          <CopyButton 
            text={walletAddress}
            successMessage="Đã sao chép địa chỉ!"
            size="md"
          />
          
          {showExplorer && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              title="Xem trên Explorer"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-gray-100" />
            </a>
          )}
        </div>
      </div>
      
      {showExplorer && (
        <p className="mt-2 text-xs text-gray-500">
          Click biểu tượng để xem trên {network === 'sepolia' ? 'Sepolia ' : ''}Etherscan
        </p>
      )}
    </div>
  )
}

export default AddressDisplay

/**
 * Balance Card Component
 * File: src/components/wallet/BalanceCard.jsx
 */

import { useState } from 'react'
import { Wallet, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import { formatEth } from '../../utils/formatter'
import Card from '../common/Card'
import clsx from 'clsx'

const BalanceCard = () => {
  const { balance, refreshBalance, network } = useWallet()
  const toast = useToast()
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await refreshBalance()
      toast.success('Đã cập nhật số dư')
    } catch (error) {
      toast.error('Không thể cập nhật số dư')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-primary-600 to-primary-800 border-primary-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-primary-100">Số dư khả dụng</p>
            <p className="text-xs text-primary-200 capitalize">
              {network === 'sepolia' ? 'Sepolia Testnet' : 'Ethereum Mainnet'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
          title="Làm mới số dư"
        >
          <RefreshCw className={clsx(
            'w-5 h-5 text-white',
            refreshing && 'animate-spin'
          )} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-white">
            {formatEth(balance)}
          </span>
          <span className="text-xl text-primary-100">ETH</span>
        </div>

        {/* USD Value placeholder (nếu có API giá) */}
        <div className="flex items-center gap-2 text-primary-100">
          <span className="text-sm">≈ $0.00 USD</span>
          <div className="flex items-center gap-1 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>0.00%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mt-6">
        <a
          href="/send"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-white text-sm font-medium"
        >
          <TrendingUp className="w-4 h-4" />
          Gửi
        </a>
        <a
          href="/receive"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors text-white text-sm font-medium"
        >
          <TrendingDown className="w-4 h-4" />
          Nhận
        </a>
      </div>
    </Card>
  )
}

export default BalanceCard

/**
 * QR Code Display Component
 * File: src/components/wallet/QRCodeDisplay.jsx
 */

import { QRCodeSVG } from 'qrcode.react'
import { Download } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { formatAddress } from '../../utils/formatter'
import CopyButton from '../common/CopyButton'

const QRCodeDisplay = ({ 
  size = 200,
  showAddress = true,
  showDownload = true,
  className 
}) => {
  const { walletAddress } = useWallet()

  if (!walletAddress) return null

  const handleDownload = () => {
    // Lấy SVG element
    const svg = document.getElementById('wallet-qrcode')
    if (!svg) return

    // Convert SVG to canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const data = new XMLSerializer().serializeToString(svg)
    const img = new Image()
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)

      // Download as PNG
      canvas.toBlob((blob) => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `wallet-qr-${walletAddress.slice(0, 8)}.png`
        link.click()
      })
    }

    img.src = url
  }

  return (
    <div className={className}>
      <div className="flex flex-col items-center">
        {/* QR Code */}
        <div className="p-4 bg-white rounded-xl">
          <QRCodeSVG
            id="wallet-qrcode"
            value={walletAddress}
            size={size}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Address */}
        {showAddress && (
          <div className="mt-4 w-full max-w-md">
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-800 border border-gray-700 rounded-lg">
              <code className="text-sm text-gray-100 font-mono">
                {formatAddress(walletAddress, 10, 8)}
              </code>
              <CopyButton 
                text={walletAddress}
                successMessage="Đã sao chép địa chỉ!"
                size="sm"
              />
            </div>
          </div>
        )}

        {/* Download Button */}
        {showDownload && (
          <button
            onClick={handleDownload}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-sm text-gray-300"
          >
            <Download className="w-4 h-4" />
            Tải QR Code
          </button>
        )}

        {/* Helper Text */}
        <p className="mt-4 text-sm text-gray-400 text-center max-w-md">
          Quét mã QR này để nhận tiền vào ví của bạn
        </p>
      </div>
    </div>
  )
}

export default QRCodeDisplay

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