/**
 * Transaction List Component
 * File: src/components/transaction/TransactionList.jsx
 */

import { useEffect, useState } from 'react'
import { History, RefreshCw } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import TransactionItem from './TransactionItem'
import Loading from '../common/Loading'
import Card from '../common/Card'

const TransactionList = ({ limit = 10 }) => {
  const { fetchTransactions } = useWallet()
  const toast = useToast()
  
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const txs = await fetchTransactions(limit)
      setTransactions(txs)
    } catch (error) {
      toast.error('Không thể tải lịch sử giao dịch')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const txs = await fetchTransactions(limit)
      setTransactions(txs)
      toast.success('Đã cập nhật lịch sử giao dịch')
    } catch (error) {
      toast.error('Không thể tải lịch sử giao dịch')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  if (loading) {
    return (
      <Card>
        <Loading text="Đang tải giao dịch..." />
      </Card>
    )
  }

  return (
    <Card>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-100">
            Giao dịch gần đây
          </h3>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          title="Làm mới"
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Transaction List */}
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Chưa có giao dịch nào</p>
          <p className="text-sm text-gray-500 mt-1">
            Các giao dịch của bạn sẽ hiển thị ở đây
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}

      {/* View All Link */}
      {transactions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <a
            href="/history"
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Xem tất cả giao dịch →
          </a>
        </div>
      )}
    </Card>
  )
}

export default TransactionList