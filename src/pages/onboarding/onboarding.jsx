/**
 * Confirm Seed Phrase Page
 * File: src/pages/onboarding/ConfirmSeedPhrase.jsx
 */

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const ConfirmSeedPhrase = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const { seedPhrase } = location.state || {}

  const [selectedWords, setSelectedWords] = useState([])
  const [shuffledWords, setShuffledWords] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!seedPhrase) {
      navigate('/onboarding/create')
      return
    }

    // Shuffle words
    const words = seedPhrase.split(' ')
    const shuffled = [...words].sort(() => Math.random() - 0.5)
    setShuffledWords(shuffled)
  }, [seedPhrase, navigate])

  const handleWordClick = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word))
    } else {
      setSelectedWords([...selectedWords, word])
    }
    setError('')
  }

  const handleVerify = () => {
    const correctOrder = seedPhrase.split(' ')
    const isCorrect = selectedWords.length === 12 && 
                     selectedWords.every((word, index) => word === correctOrder[index])

    if (isCorrect) {
      toast.success('Xác nhận thành công!')
      navigate('/dashboard')
    } else {
      setError('Thứ tự các từ không đúng. Vui lòng thử lại.')
      toast.error('Thứ tự không đúng')
    }
  }

  const handleReset = () => {
    setSelectedWords([])
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Xác nhận seed phrase
          </h1>
          <p className="text-gray-400">
            Chọn các từ theo đúng thứ tự để xác nhận bạn đã lưu đúng
          </p>
        </div>

        {/* Selected Words */}
        <Card className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Seed phrase của bạn ({selectedWords.length}/12)
          </label>
          
          <div className="min-h-32 p-4 bg-gray-800 border border-gray-700 rounded-lg mb-3">
            {selectedWords.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                Chọn các từ bên dưới theo thứ tự
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <button
                    key={`selected-${index}`}
                    onClick={() => {
                      setSelectedWords(selectedWords.filter((_, i) => i !== index))
                      setError('')
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-sm text-white transition-colors"
                  >
                    <span className="font-medium">{index + 1}.</span>
                    <span>{word}</span>
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 mb-3">{error}</p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={selectedWords.length === 0}
          >
            Đặt lại
          </Button>
        </Card>

        {/* Available Words */}
        <Card className="mb-6">
          <label className="block text-sm font-medium text-gray-400 mb-3">
            Chọn từ theo thứ tự
          </label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {shuffledWords.map((word, index) => (
              <button
                key={`word-${index}`}
                onClick={() => handleWordClick(word)}
                disabled={selectedWords.includes(word)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 border border-gray-700 rounded-lg text-sm text-gray-100 transition-colors disabled:cursor-not-allowed"
              >
                {word}
              </button>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          
          <Button
            variant="primary"
            fullWidth
            onClick={handleVerify}
            disabled={selectedWords.length !== 12}
          >
            Xác nhận
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmSeedPhrase

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

/**
 * Show Seed Phrase Page
 * File: src/pages/onboarding/ShowSeedPhrase.jsx
 */

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import SeedPhraseDisplay from '../../components/wallet/SeedPhraseDisplay'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'

const ShowSeedPhrase = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { seedPhrase, encryptedSeed } = location.state || {}

  const [confirmed, setConfirmed] = useState(false)

  if (!seedPhrase) {
    navigate('/onboarding/create')
    return null
  }

  const handleContinue = () => {
    if (!confirmed) {
      return
    }
    
    navigate('/onboarding/confirm-seed', {
      state: { seedPhrase, encryptedSeed }
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Ví của bạn đã được tạo!
          </h1>
          <p className="text-gray-400">
            Hãy lưu lại 12 từ khôi phục này ngay
          </p>
        </div>

        {/* Seed Phrase */}
        <Card className="mb-6">
          <SeedPhraseDisplay 
            seedPhrase={seedPhrase}
            showWarning={true}
            allowCopy={true}
          />
        </Card>

        {/* Confirmation Checkbox */}
        <Card className="mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-800 text-primary-600 focus:ring-primary-500 focus:ring-offset-gray-900"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-100 mb-1">
                Tôi đã ghi lại 12 từ khôi phục
              </p>
              <p className="text-xs text-gray-400">
                Tôi hiểu rằng nếu mất seed phrase, tôi sẽ mất toàn bộ quyền truy cập vào ví và tất cả tài sản.
              </p>
            </div>
          </label>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/onboarding/create')}
          >
            Quay lại
          </Button>
          
          <Button
            variant="primary"
            fullWidth
            disabled={!confirmed}
            onClick={handleContinue}
            icon={<ArrowRight className="w-5 h-5" />}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ShowSeedPhrase