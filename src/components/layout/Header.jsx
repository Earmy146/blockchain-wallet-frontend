/**
 * Header Component
 * File: src/components/layout/Header.jsx
 */

import { useState } from 'react'
import { LogOut, User, Settings, Wallet, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useWallet } from '../../context/WalletContext'
import { useNavigate } from 'react-router-dom'
import { formatAddress } from '../../utils/formatter'
import clsx from 'clsx'

const Header = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { walletAddress, network, balance } = useWallet()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      logout()
    }
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gray-100">
              Blockchain Wallet
            </span>
          </div>

          {/* Network Badge */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
              <div className={clsx(
                'w-2 h-2 rounded-full',
                network === 'sepolia' ? 'bg-blue-500' : 'bg-green-500'
              )} />
              <span className="text-sm text-gray-300 capitalize">
                {network === 'sepolia' ? 'Sepolia Testnet' : 'Mainnet'}
              </span>
            </div>

            {/* Balance (Mobile hidden) */}
            {balance && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-400">Balance:</span>
                <span className="text-sm font-medium text-gray-100">
                  {parseFloat(balance).toFixed(4)} ETH
                </span>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors"
              >
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300 hidden sm:block">
                  {formatAddress(walletAddress, 6, 4)}
                </span>
                <ChevronDown className={clsx(
                  'w-4 h-4 text-gray-400 transition-transform',
                  showDropdown && 'rotate-180'
                )} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-20">
                    <div className="p-3 border-b border-gray-700">
                      <p className="text-xs text-gray-400">Account</p>
                      <p className="text-sm text-gray-100 font-medium truncate">
                        {user?.email}
                      </p>
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate('/settings')
                          setShowDropdown(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header