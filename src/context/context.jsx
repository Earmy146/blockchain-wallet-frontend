/**
 * Auth Context Provider
 * File: src/context/AuthContext.jsx
 */

import { createContext, useContext } from 'react'
import { useAuth as useAuthHook } from '../hooks/useAuth'

// Tạo context
const AuthContext = createContext(null)

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuthHook()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook để sử dụng Auth Context
 * Sử dụng trong components: const { user, login, logout } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

export default AuthContext

/**
 * Toast Context Provider
 * File: src/context/ToastContext.jsx
 */

import { createContext, useContext, useCallback } from 'react'
import toast from 'react-hot-toast'

// Tạo context
const ToastContext = createContext(null)

/**
 * Toast Provider Component
 */
export const ToastProvider = ({ children }) => {
  /**
   * Show success toast
   */
  const showSuccess = useCallback((message, options = {}) => {
    toast.success(message, {
      duration: 3000,
      ...options,
    })
  }, [])

  /**
   * Show error toast
   */
  const showError = useCallback((message, options = {}) => {
    toast.error(message, {
      duration: 4000,
      ...options,
    })
  }, [])

  /**
   * Show info toast
   */
  const showInfo = useCallback((message, options = {}) => {
    toast(message, {
      duration: 3000,
      icon: 'ℹ️',
      ...options,
    })
  }, [])

  /**
   * Show warning toast
   */
  const showWarning = useCallback((message, options = {}) => {
    toast(message, {
      duration: 3500,
      icon: '⚠️',
      ...options,
    })
  }, [])

  /**
   * Show loading toast (returns toast id for dismiss)
   */
  const showLoading = useCallback((message, options = {}) => {
    return toast.loading(message, {
      ...options,
    })
  }, [])

  /**
   * Dismiss specific toast
   */
  const dismiss = useCallback((toastId) => {
    toast.dismiss(toastId)
  }, [])

  /**
   * Dismiss all toasts
   */
  const dismissAll = useCallback(() => {
    toast.dismiss()
  }, [])

  /**
   * Show promise toast (for async operations)
   */
  const showPromise = useCallback((promise, messages) => {
    return toast.promise(promise, {
      loading: messages.loading || 'Đang xử lý...',
      success: messages.success || 'Thành công!',
      error: messages.error || 'Đã có lỗi xảy ra',
    })
  }, [])

  /**
   * Show custom toast
   */
  const showCustom = useCallback((component, options = {}) => {
    toast.custom(component, {
      duration: 3000,
      ...options,
    })
  }, [])

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
    dismissAll,
    showPromise,
    showCustom,
    
    // Alias (viết tắt)
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    loading: showLoading,
    promise: showPromise,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

/**
 * Custom hook để sử dụng Toast Context
 * Sử dụng trong components: const toast = useToast()
 * toast.success('Message'), toast.error('Error'), ...
 */
export const useToast = () => {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  
  return context
}

export default ToastContext

/**
 * Wallet Context Provider
 * File: src/context/WalletContext.jsx
 */

import { createContext, useContext } from 'react'
import { useWallet as useWalletHook } from '../hooks/useWallet'

// Tạo context
const WalletContext = createContext(null)

/**
 * Wallet Provider Component
 */
export const WalletProvider = ({ children }) => {
  const wallet = useWalletHook()

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  )
}

/**
 * Custom hook để sử dụng Wallet Context
 * Sử dụng trong components: const { wallet, balance, sendTransaction } = useWallet()
 */
export const useWallet = () => {
  const context = useContext(WalletContext)
  
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  
  return context
}

export default WalletContext