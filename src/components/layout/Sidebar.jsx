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