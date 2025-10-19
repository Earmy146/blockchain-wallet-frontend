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