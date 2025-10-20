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