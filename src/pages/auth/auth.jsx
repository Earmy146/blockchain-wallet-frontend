/**
 * Login Page
 * File: src/pages/auth/Login.jsx
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useWallet } from '../../context/WalletContext'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { hasWallet } = useWallet()
  const toast = useToast()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email là bắt buộc'
    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      await login(formData)
      
      toast.success('Đăng nhập thành công!')
      
      // Redirect dựa vào có ví chưa
      setTimeout(() => {
        if (hasWallet) {
          navigate('/dashboard')
        } else {
          navigate('/onboarding/create')
        }
      }, 500)
      
    } catch (error) {
      toast.error(error.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Đăng nhập
          </h1>
          <p className="text-gray-400">
            Chào mừng bạn trở lại!
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              autoComplete="email"
              required
            />

            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

/**
 * Register Page
 * File: src/pages/auth/Register.jsx
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet, Mail, Lock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { validateRegisterForm, getPasswordStrength, getPasswordStrengthText, getPasswordStrengthColor } from '../../utils/validation'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const passwordStrength = getPasswordStrength(formData.password)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateRegisterForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setLoading(true)
      await register(formData)
      
      toast.success('Đăng ký thành công!')
      navigate('/onboarding/create')
      
    } catch (error) {
      toast.error(error.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            Tạo tài khoản
          </h1>
          <p className="text-gray-400">
            Bắt đầu với ví blockchain của bạn
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
              required
            />

            <div>
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                placeholder="Ít nhất 8 ký tự"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock className="w-5 h-5" />}
                required
              />
              
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          passwordStrength === 0 ? 'w-1/5 bg-red-500' :
                          passwordStrength === 1 ? 'w-2/5 bg-orange-500' :
                          passwordStrength === 2 ? 'w-3/5 bg-yellow-500' :
                          passwordStrength === 3 ? 'w-4/5 bg-green-500' :
                          'w-full bg-emerald-500'
                        }`}
                      />
                    </div>
                    <span className={`text-xs ${getPasswordStrengthColor(passwordStrength)}`}>
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Xác nhận mật khẩu"
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register


/**
 * Welcome Page
 * File: src/pages/auth/Welcome.jsx
 */

import { Link } from 'react-router-dom'
import { Wallet, Shield, Zap, ArrowRight } from 'lucide-react'
import Button from '../../components/common/Button'

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo & Title */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wallet className="w-16 h-16 text-primary-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-100 mb-4">
            Blockchain Wallet
          </h1>
          <p className="text-xl text-gray-400">
            Ví điện tử phi tập trung cho Ethereum
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-primary-600 transition-colors">
            <div className="w-12 h-12 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">An toàn tuyệt đối</h3>
            <p className="text-sm text-gray-400">
              Seed phrase được mã hóa, không lưu trên server
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-primary-600 transition-colors">
            <div className="w-12 h-12 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Nhanh chóng</h3>
            <p className="text-sm text-gray-400">
              Giao dịch nhanh trên Ethereum blockchain
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center hover:border-primary-600 transition-colors">
            <div className="w-12 h-12 bg-primary-600 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-primary-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Dễ sử dụng</h3>
            <p className="text-sm text-gray-400">
              Giao diện đơn giản, thân thiện với người dùng
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-100 text-center mb-6">
            Bắt đầu ngay hôm nay
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Link to="/register" className="flex-1">
              <Button variant="primary" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
                Tạo tài khoản mới
              </Button>
            </Link>
            
            <Link to="/login" className="flex-1">
              <Button variant="outline" fullWidth>
                Đăng nhập
              </Button>
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sử dụng Sepolia Testnet - ETH test miễn phí
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Đồ án môn học Blockchain | Made with ❤️</p>
        </div>
      </div>
    </div>
  )
}

export default Welcome