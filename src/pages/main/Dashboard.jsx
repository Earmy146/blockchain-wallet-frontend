/**
 * Dashboard Page
 * File: src/pages/main/Dashboard.jsx
 */

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import BalanceCard from '../../components/wallet/BalanceCard'
import AddressDisplay from '../../components/wallet/AddressDisplay'
import TransactionList from '../../components/transaction/TransactionList'
import Card from '../../components/common/Card'
import Loading from '../../components/common/Loading'

const Dashboard = () => {
  const { wallet, fetchWallet, fetchTransactionStats } = useWallet()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        if (!wallet) {
          await fetchWallet()
        }
        
        const statsData = await fetchTransactionStats()
        setStats(statsData)
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loading size="lg" text="Đang tải dữ liệu..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
        <p className="text-gray-400">Tổng quan tài khoản của bạn</p>
      </div>

      <BalanceCard />
      <AddressDisplay showFull={false} showExplorer={true} />

      {stats && (
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 bg-opacity-20 rounded-lg">
                <TrendingDown className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tổng nhận</p>
                <p className="text-xl font-bold text-gray-100">
                  {parseFloat(stats.totalReceived).toFixed(4)} ETH
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600 bg-opacity-20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tổng gửi</p>
                <p className="text-xl font-bold text-gray-100">
                  {parseFloat(stats.totalSent).toFixed(4)} ETH
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-600 bg-opacity-20 rounded-lg">
                <Activity className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Tổng giao dịch</p>
                <p className="text-xl font-bold text-gray-100">
                  {stats.totalTransactions}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <TransactionList limit={5} />
    </div>
  )
}

export default Dashboard