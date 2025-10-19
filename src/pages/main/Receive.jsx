/**
 * Receive Page
 * File: src/pages/main/Receive.jsx
 */

import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../context/WalletContext'
import { getExplorerAddressUrl } from '../../utils/formatter'
import QRCodeDisplay from '../../components/wallet/QRCodeDisplay'
import AddressDisplay from '../../components/wallet/AddressDisplay'
import Card from '../../components/common/Card'

const Receive = () => {
  const navigate = useNavigate()
  const { walletAddress, network } = useWallet()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Nhận ETH</h1>
          <p className="text-gray-400">Chia sẻ địa chỉ hoặc QR code của bạn</p>
        </div>
      </div>

      {/* QR Code */}
      <Card>
        <QRCodeDisplay 
          size={250}
          showAddress={true}
          showDownload={true}
        />
      </Card>

      {/* Address Display */}
      <AddressDisplay 
        showFull={true}
        showExplorer={true}
      />

      {/* Instructions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">
          Cách nhận ETH
        </h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center text-primary-500 font-bold">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100 mb-1">
                Sao chép địa chỉ
              </p>
              <p className="text-sm text-gray-400">
                Click nút copy để sao chép địa chỉ ví của bạn
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center text-primary-500 font-bold">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100 mb-1">
                Chia sẻ với người gửi
              </p>
              <p className="text-sm text-gray-400">
                Gửi địa chỉ hoặc QR code cho người muốn chuyển ETH cho bạn
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center text-primary-500 font-bold">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-gray-100 mb-1">
                Chờ xác nhận
              </p>
              <p className="text-sm text-gray-400">
                Sau khi giao dịch được gửi, số dư sẽ tự động cập nhật
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Warning */}
      <Card className="bg-yellow-500 bg-opacity-5 border-yellow-500 border-opacity-30">
        <div className="flex gap-3">
          <div className="text-2xl">⚠️</div>
          <div>
            <h4 className="text-sm font-semibold text-yellow-500 mb-2">
              Chỉ nhận ETH trên {network === 'sepolia' ? 'Sepolia Testnet' : 'Ethereum Mainnet'}
            </h4>
            <ul className="text-sm text-yellow-200 space-y-1">
              <li>• Đảm bảo người gửi sử dụng đúng network</li>
              <li>• Không nhận token ERC-20 hoặc NFT vào địa chỉ này</li>
              <li>• Giao dịch sai network sẽ bị mất vĩnh viễn</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Faucet Link (Sepolia only) */}
      {network === 'sepolia' && (
        <Card className="bg-blue-500 bg-opacity-5 border-blue-500 border-opacity-30">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            🚰 Lấy ETH test miễn phí
          </h3>
          <p className="text-sm text-blue-200 mb-4">
            Bạn đang dùng Sepolia Testnet. Có thể lấy ETH test miễn phí từ các faucet:
          </p>
          <div className="space-y-2">
            <a
              href="https://sepoliafaucet.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-100">Alchemy Sepolia Faucet</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://faucet.quicknode.com/ethereum/sepolia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-sm text-gray-100">QuickNode Faucet</span>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </Card>
      )}
    </div>
  )
}

export default Receive