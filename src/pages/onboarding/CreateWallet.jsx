/**
 * Create Wallet Page
 * File: src/pages/onboarding/CreateWallet.jsx
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Plus, RefreshCw, AlertTriangle } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'

const CreateWallet = () => {
  const navigate = useNavigate()
  const { createWallet } = useWallet()
  const toast = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const newErrors = {}
    if (!password) {
      newErrors.password = 'Mật khẩu là bắt buộc'
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      
      const result = await createWallet(password, 'sepolia')
      
      // Lưu seed phrase vào state để chuyển sang trang tiếp theo
      navigate('/onboarding/show-seed', { 
        state: { 
          seedPhrase: result.seedPhrase,
          encryptedSeed: result.encryptedSeed 
        } 
      })
      
    } catch (error) {
      toast.error(error.message || 'Tạo ví thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Tạo ví mới
          </h1>
          <p className="text-gray-400">
            Chọn cách khởi tạo ví của bạn
          </p>
        </div>

        {/* Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:border-primary-600 transition-all"
            hoverable
          >
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Tạo ví mới
              </h3>
              <p className="text-sm text-gray-400">
                Tạo seed phrase mới và địa chỉ ví
              </p>
            </div>
          </Card>

          <Card 
            className="cursor-pointer hover:border-primary-600 transition-all"
            hoverable
            onClick={() => navigate('/onboarding/restore')}
          >
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                Khôi phục ví
              </h3>
              <p className="text-sm text-gray-400">
                Sử dụng 12 từ seed phrase có sẵn
              </p>
            </div>
          </Card>
        </div>

        {/* Create Form */}
        <Card>
          <div className="mb-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-500 mb-1">
                  ⚠️ Quan trọng
                </h4>
                <p className="text-sm text-yellow-200">
                  Mật khẩu này dùng để mã hóa seed phrase. Hãy nhớ kỹ, bạn sẽ cần nó mỗi khi gửi giao dịch.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Mật khẩu ví"
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
              }}
              error={errors.password}
              helperText="Mật khẩu này KHÁC với mật khẩu đăng nhập"
              required
            />

            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }))
              }}
              error={errors.confirmPassword}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Tạo ví ngay
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default CreateWallet