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