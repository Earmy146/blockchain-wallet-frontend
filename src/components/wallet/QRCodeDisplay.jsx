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