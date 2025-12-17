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

/**
 * Settings Page
 * File: src/pages/main/Settings.jsx
 */

import { useState } from 'react'
import { Settings as SettingsIcon, Key, Eye, Network, AlertTriangle, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import { getEncryptedSeed } from '../../utils/storage'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const Settings = () => {
  const { user, logout } = useAuth()
  const { network, switchNetwork, revealSeedPhrase } = useWallet()
  const toast = useToast()

  const [showSeedModal, setShowSeedModal] = useState(false)
  const [password, setPassword] = useState('')
  const [revealedSeed, setRevealedSeed] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRevealSeed = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const encryptedSeed = getEncryptedSeed()
      
      if (!encryptedSeed) {
        toast.error('Không tìm thấy seed phrase')
        return
      }

      const seed = await revealSeedPhrase(password)
      setRevealedSeed(seed)
      setPassword('')
      
    } catch (error) {
      toast.error(error.message || 'Mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchNetwork = async (newNetwork) => {
    if (newNetwork === network) return

    try {
      await switchNetwork(newNetwork)
      toast.success(`Đã chuyển sang ${newNetwork === 'sepolia' ? 'Sepolia' : 'Mainnet'}`)
    } catch (error) {
      toast.error('Không thể chuyển network')
    }
  }

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Cài đặt</h1>
        <p className="text-gray-400">Quản lý tài khoản và ví của bạn</p>
      </div>

      {/* Account Info */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Thông tin tài khoản</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-400">Email</span>
            <span className="text-sm text-gray-100 font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <span className="text-sm text-gray-400">Username</span>
            <span className="text-sm text-gray-100 font-medium">{user?.username || 'N/A'}</span>
          </div>
        </div>
      </Card>

      {/* Network Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Network className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-100">Mạng blockchain</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSwitchNetwork('sepolia')}
            className={`p-4 rounded-lg border-2 transition-all ${
              network === 'sepolia'
                ? 'border-primary-600 bg-primary-600 bg-opacity-10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold text-gray-100 mb-1">Sepolia Testnet</p>
              <p className="text-xs text-gray-400">Dùng để test</p>
            </div>
          </button>

          <button
            onClick={() => handleSwitchNetwork('mainnet')}
            className={`p-4 rounded-lg border-2 transition-all ${
              network === 'mainnet'
                ? 'border-primary-600 bg-primary-600 bg-opacity-10'
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="text-left">
              <p className="font-semibold text-gray-100 mb-1">Ethereum Mainnet</p>
              <p className="text-xs text-gray-400">Mạng chính thức</p>
            </div>
          </button>
        </div>
      </Card>

      {/* Security Settings */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-100">Bảo mật</h3>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => setShowSeedModal(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 border border-gray-700 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-gray-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-100">Xem Seed Phrase</p>
                <p className="text-xs text-gray-400">Hiển thị 12 từ khôi phục</p>
              </div>
            </div>
            <span className="text-xs text-gray-500">→</span>
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500 border-opacity-30">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-red-500">Vùng nguy hiểm</h3>
        </div>

        <div className="space-y-3">
          <Button
            variant="danger"
            fullWidth
            onClick={handleLogout}
            icon={<LogOut className="w-5 h-5" />}
          >
            Đăng xuất
          </Button>
        </div>
      </Card>

      {/* Reveal Seed Modal */}
      {showSeedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full">
            {!revealedSeed ? (
              <>
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  Xem Seed Phrase
                </h3>
                
                <div className="mb-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
                  <div className="flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-500 mb-1">
                        ⚠️ Cảnh báo
                      </h4>
                      <p className="text-sm text-yellow-200">
                        Không bao giờ chia sẻ seed phrase với bất kỳ ai. 
                        Bất kỳ ai có seed phrase đều có thể truy cập vào ví của bạn.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRevealSeed} className="space-y-4">
                  <Input
                    label="Nhập mật khẩu ví để xác nhận"
                    type="password"
                    placeholder="Mật khẩu ví"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      fullWidth
                      onClick={() => {
                        setShowSeedModal(false)
                        setPassword('')
                      }}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      loading={loading}
                    >
                      Hiển thị
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-100 mb-4">
                  Seed Phrase của bạn
                </h3>

                <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 rounded-lg">
                  <p className="text-sm text-red-400">
                    🚨 Không chụp ảnh màn hình này! Viết ra giấy và cất giữ an toàn.
                  </p>
                </div>

                <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                  <div className="grid grid-cols-3 gap-3">
                    {revealedSeed.split(' ').map((word, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-900 rounded">
                        <span className="text-xs text-gray-500 font-medium">{index + 1}.</span>
                        <span className="text-sm text-gray-100 font-mono">{word}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setShowSeedModal(false)
                    setRevealedSeed('')
                    setPassword('')
                  }}
                >
                  Đóng
                </Button>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  )
}

export default Settings