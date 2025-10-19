/**
 * React Router Configuration
 * File: src/router.jsx
 */

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useWallet } from './context/WalletContext'

// Layout
import Layout from './components/layout/Layout'

// Auth Pages
import Welcome from './pages/auth/Welcome'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'

// Onboarding Pages
import CreateWallet from './pages/onboarding/CreateWallet'
import ShowSeedPhrase from './pages/onboarding/ShowSeedPhrase'
import ConfirmSeedPhrase from './pages/onboarding/ConfirmSeedPhrase'
import RestoreWallet from './pages/onboarding/RestoreWallet'

// Main Pages
import Dashboard from './pages/main/Dashboard'
import Send from './pages/main/Send'
import Receive from './pages/main/Receive'
import History from './pages/main/History'
import Settings from './pages/main/Settings'

/**
 * Protected Route - Yêu cầu đăng nhập
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

/**
 * Wallet Required Route - Yêu cầu có ví
 */
const WalletRequiredRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const { hasWallet } = useWallet()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (!hasWallet) {
    return <Navigate to="/onboarding/create" replace />
  }
  
  return children
}

/**
 * Guest Only Route - Chỉ cho phép khi chưa đăng nhập
 */
const GuestOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

/**
 * Main Router Component
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes - Không cần đăng nhập */}
      <Route path="/" element={
        <GuestOnlyRoute>
          <Welcome />
        </GuestOnlyRoute>
      } />
      
      <Route path="/register" element={
        <GuestOnlyRoute>
          <Register />
        </GuestOnlyRoute>
      } />
      
      <Route path="/login" element={
        <GuestOnlyRoute>
          <Login />
        </GuestOnlyRoute>
      } />

      {/* Onboarding Routes - Cần đăng nhập, chưa có ví */}
      <Route path="/onboarding">
        <Route path="create" element={
          <ProtectedRoute>
            <CreateWallet />
          </ProtectedRoute>
        } />
        
        <Route path="show-seed" element={
          <ProtectedRoute>
            <ShowSeedPhrase />
          </ProtectedRoute>
        } />
        
        <Route path="confirm-seed" element={
          <ProtectedRoute>
            <ConfirmSeedPhrase />
          </ProtectedRoute>
        } />
        
        <Route path="restore" element={
          <ProtectedRoute>
            <RestoreWallet />
          </ProtectedRoute>
        } />
      </Route>

      {/* Main App Routes - Cần đăng nhập VÀ có ví */}
      <Route path="/" element={
        <WalletRequiredRoute>
          <Layout />
        </WalletRequiredRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="send" element={<Send />} />
        <Route path="receive" element={<Receive />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-primary-500 mb-4">404</h1>
            <p className="text-xl text-gray-400 mb-8">Trang không tồn tại</p>
            <a href="/" className="btn btn-primary">
              Về trang chủ
            </a>
          </div>
        </div>
      } />
    </Routes>
  )
}

export default AppRoutes