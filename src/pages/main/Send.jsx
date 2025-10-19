/**
 * Send Page
 * File: src/pages/main/Send.jsx
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send as SendIcon, ArrowLeft } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import SendForm from '../../components/transaction/SendForm'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'

const Send = () => {
  const navigate = useNavigate()
  const { balance, walletAddress } = useWallet()
  const [recentTx, setRecentTx] = useState(null)

  const handleSuccess = (tx) => {
    setRecentTx(tx)
    
    // Tự động redirect sau 3 giây
    setTimeout(() => {
      navigate('/history')
    }, 3000)
  }

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
          <h1 className="text-3xl font-bold text-gray-100">Gửi ETH</h1>
          <p className="text-gray-400">Chuyển ETH đến địa chỉ khác</p>
        </div>
      </div>

      {/* Balance Info */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Số dư khả dụng</p>
            <p className="text-2xl font-bold text-gray-100">
              {parseFloat(balance).toFixed(6)} ETH
            </p>
          </div>
          <div className="p-3 bg-primary-600 bg-opacity-20 rounded-lg">
            <SendIcon className="w-8 h-8 text-primary-500" />
          </div>
        </div>
      </Card>

      {/* Send Form */}
      {recentTx ? (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <SendIcon className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-100 mb-2">
              Giao dịch đã được gửi!
            </h3>
            <p className="text-gray-400 mb-4">
              Đang chờ xác nhận trên blockchain...
            </p>
            <div className="space-y-2 text-sm text-left max-w-md mx-auto">
              <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Số tiền:</span>
                <span className="text-gray-100 font-medium">{recentTx.amount} ETH</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Đến:</span>
                <code className="text-gray-100 font-mono text-xs">
                  {recentTx.to?.slice(0, 10)}...{recentTx.to?.slice(-8)}
                </code>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/history')}
              >
                Xem lịch sử giao dịch
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setRecentTx(null)
                  navigate(0) // Reload page
                }}
              >
                Gửi giao dịch khác
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <SendForm onSuccess={handleSuccess} />
      )}

      {/* Tips */}
      <Card>
        <h3 className="text-sm font-semibold text-gray-100 mb-3">💡 Lưu ý</h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Kiểm tra kỹ địa chỉ người nhận trước khi gửi</li>
          <li>• Giao dịch trên blockchain không thể hoàn tác</li>
          <li>• Phí gas sẽ thay đổi tùy theo tình trạng mạng</li>
          <li>• Giữ lại một ít ETH để trả phí gas cho các giao dịch sau</li>
        </ul>
      </Card>
    </div>
  )
}

export default Send