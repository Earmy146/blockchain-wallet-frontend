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


/**
 * Layout Component
 * File: src/components/layout/Layout.jsx
 */

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-0 z-30 bg-gray-950 border-b border-gray-800 px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">Menu</span>
            </button>
          </div>

          {/* Page Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

/**
 * Sidebar Component
 * File: src/components/layout/Sidebar.jsx
 */

import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Send, 
  Wallet, 
  History, 
  Settings,
  X 
} from 'lucide-react'
import clsx from 'clsx'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard'
    },
    {
      path: '/send',
      icon: Send,
      label: 'Gửi tiền'
    },
    {
      path: '/receive',
      icon: Wallet,
      label: 'Nhận tiền'
    },
    {
      path: '/history',
      icon: History,
      label: 'Lịch sử'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Cài đặt'
    }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={clsx(
        'fixed lg:sticky top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 z-50',
        'transition-transform duration-300 ease-in-out',
        'w-64 flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Close button (Mobile only) */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-lg font-semibold text-gray-100">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={({ isActive }) => clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                  'hover:bg-gray-800',
                  isActive 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-100'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <div className="px-4 py-3 bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-400 mb-1">Version</p>
            <p className="text-sm text-gray-100 font-medium">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar