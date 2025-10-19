/**
 * History Page
 * File: src/pages/main/History.jsx
 */

import { useState, useEffect } from 'react'
import { History as HistoryIcon, Download, Filter, RefreshCw } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import TransactionItem from '../../components/transaction/TransactionItem'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Loading from '../../components/common/Loading'

const History = () => {
  const { fetchTransactions, exportTransactions } = useWallet()
  const toast = useToast()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [filter, setFilter] = useState('all') // all, send, receive
  const [exporting, setExporting] = useState(false)

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const txs = await fetchTransactions(50)
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
      const txs = await fetchTransactions(50)
      setTransactions(txs)
      toast.success('Đã cập nhật')
    } catch (error) {
      toast.error('Không thể tải lịch sử')
    } finally {
      setRefreshing(false)
    }
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      await exportTransactions()
      toast.success('Đã tải xuống file CSV')
    } catch (error) {
      toast.error('Không thể export')
    } finally {
      setExporting(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true
    return tx.type === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Lịch sử giao dịch</h1>
          <p className="text-gray-400">Tất cả giao dịch của bạn</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            icon={<RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />}
          >
            Làm mới
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            loading={exporting}
            icon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'Tất cả' },
              { value: 'send', label: 'Đã gửi' },
              { value: 'receive', label: 'Đã nhận' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-400">
            {filteredTransactions.length} giao dịch
          </span>
        </div>
      </Card>

      {/* Transaction List */}
      {loading ? (
        <Card>
          <Loading text="Đang tải giao dịch..." />
        </Card>
      ) : filteredTransactions.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <HistoryIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 mb-1">
              {filter === 'all' 
                ? 'Chưa có giao dịch nào'
                : filter === 'send'
                ? 'Chưa có giao dịch gửi đi'
                : 'Chưa có giao dịch nhận vào'
              }
            </p>
            <p className="text-sm text-gray-500">
              Các giao dịch sẽ hiển thị ở đây
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <TransactionItem key={tx.id} transaction={tx} />
          ))}
        </div>
      )}
    </div>
  )
}

export default History