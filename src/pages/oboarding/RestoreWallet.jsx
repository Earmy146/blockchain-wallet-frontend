/**
 * Restore Wallet Page
 * File: src/pages/onboarding/RestoreWallet.jsx
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RefreshCw, AlertTriangle } from 'lucide-react'
import { useWallet } from '../../context/WalletContext'
import { useToast } from '../../context/ToastContext'
import { isValidSeedPhrase } from '../../utils/validation'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'

const RestoreWallet = () => {
  const navigate = useNavigate()
  const { restoreWallet } = useWallet()
  const toast = useToast()

  const [seedPhrase, setSeedPhrase] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    const newErrors = {}
    
    if (!seedPhrase) {
      newErrors.seedPhrase = 'Seed phrase là bắt buộc'
    } else if (!isValidSeedPhrase(seedPhrase)) {
      newErrors.seedPhrase = 'Seed phrase phải có đúng 12 từ'
    }

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
      
      await restoreWallet(seedPhrase.trim(), password, 'sepolia')
      
      toast.success('Khôi phục ví thành công!')
      navigate('/dashboard')
      
    } catch (error) {
      toast.error(error.message || 'Khôi phục ví thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Khôi phục ví
          </h1>
          <p className="text-gray-400">
            Nhập 12 từ seed phrase để khôi phục ví của bạn
          </p>
        </div>

        <Card>
          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30 rounded-lg">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-500 mb-1">
                  ⚠️ Lưu ý
                </h4>
                <ul className="text-sm text-yellow-200 space-y-1">
                  <li>• Nhập đúng 12 từ theo thứ tự</li>
                  <li>• Các từ cách nhau bởi dấu cách</li>
                  <li>• Seed phrase phân biệt chữ hoa chữ thường</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seed Phrase */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Seed Phrase (12 từ)
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                value={seedPhrase}
                onChange={(e) => {
                  setSeedPhrase(e.target.value)
                  if (errors.seedPhrase) setErrors(prev => ({ ...prev, seedPhrase: '' }))
                }}
                placeholder="word1 word2 word3 ... word12"
                rows={4}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors font-mono text-sm"
              />
              {errors.seedPhrase && (
                <p className="mt-1 text-sm text-red-500">{errors.seedPhrase}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Số từ: {seedPhrase.trim().split(/\s+/).filter(w => w).length}/12
              </p>
            </div>

            {/* Password */}
            <Input
              label="Mật khẩu ví mới"
              type="password"
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }))
              }}
              error={errors.password}
              helperText="Mật khẩu để mã hóa seed phrase trên thiết bị này"
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

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate('/onboarding/create')}
              >
                Quay lại
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Khôi phục ví
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default RestoreWallet