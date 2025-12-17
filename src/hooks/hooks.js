/**
 * useAuth Hook
 * File: src/hooks/useAuth.js
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth.api'
import * as storage from '../utils/storage'
import { useToken, useUserStorage } from './useLocalStorage'

/**
 * Custom hook để quản lý authentication
 */
export const useAuth = () => {
  const navigate = useNavigate()
  
  const [token, setToken] = useToken()
  const [user, setUser] = useUserStorage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)

  /**
   * Đăng ký user mới
   */
  const register = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.register(data)
      
      // Lưu token và user
      setToken(response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      
      return response
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setToken, setUser])

  /**
   * Đăng nhập
   */
  const login = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.login(data)
      
      // Lưu token và user
      setToken(response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      
      return response
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setToken, setUser])

  /**
   * Đăng xuất
   */
  const logout = useCallback(() => {
    // Xóa tất cả dữ liệu
    storage.clearAll()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    
    // Redirect về login
    navigate('/login')
  }, [setToken, setUser, navigate])

  /**
   * Verify token khi app khởi động
   */
  const verifyAuth = useCallback(async () => {
    if (!token) {
      setIsAuthenticated(false)
      return false
    }

    try {
      setLoading(true)
      const response = await authApi.verifyToken()
      
      // Token hợp lệ
      setUser(response.user)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      // Token không hợp lệ hoặc hết hạn
      console.error('Token verification failed:', err)
      logout()
      return false
    } finally {
      setLoading(false)
    }
  }, [token, setUser, logout])

  /**
   * Lấy thông tin user mới nhất
   */
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authApi.getMe()
      setUser(response.user)
      return response.user
    } catch (err) {
      console.error('Failed to refresh user:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  /**
   * Đổi mật khẩu
   */
  const changePassword = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      await authApi.changePassword(data)
      return true
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Cập nhật profile
   */
  const updateProfile = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.updateProfile(data)
      setUser(response.user)
      
      return response.user
    } catch (err) {
      setError(err.message || 'Cập nhật profile thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  /**
   * Xóa tài khoản
   */
  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await authApi.deleteAccount()
      logout()
      
      return true
    } catch (err) {
      setError(err.message || 'Xóa tài khoản thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [logout])

  // Auto verify token khi component mount
  useEffect(() => {
    if (token && !user) {
      verifyAuth()
    }
  }, [token, user, verifyAuth])

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    register,
    login,
    logout,
    verifyAuth,
    refreshUser,
    changePassword,
    updateProfile,
    deleteAccount,
  }
}

export default useAuth

/**
 * useLocalStorage Hook
 * File: src/hooks/useLocalStorage.js
 * 
 * FIX: Không stringify token (JWT string)
 */
import { useState, useEffect } from 'react'

/**
 * Custom hook để làm việc với localStorage
 * @param {String} key - Key trong localStorage
 * @param {*} initialValue - Giá trị khởi tạo
 * @returns {[value, setValue, removeValue]} - State value, setter, remover
 */
export const useLocalStorage = (key, initialValue) => {
  // State để lưu giá trị
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Lấy giá trị từ localStorage
      const item = window.localStorage.getItem(key)
      
      // Parse nếu có, không thì dùng initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  /**
   * Set giá trị mới
   */
  const setValue = (value) => {
    try {
      // Cho phép value là function như useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      
      // Update state
      setStoredValue(valueToStore)
      
      // Lưu vào localStorage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  /**
   * Xóa giá trị
   */
  const removeValue = () => {
    try {
      // Xóa khỏi localStorage
      window.localStorage.removeItem(key)
      
      // Reset state về initialValue
      setStoredValue(initialValue)
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}

/**
 * Hook để lưu token
 * FIX: Token là string, không cần JSON.stringify
 */
export const useToken = () => {
  const [token, setToken] = useState(() => {
    try {
      // ✅ LẤY TRỰC TIẾP - KHÔNG PARSE JSON
      return window.localStorage.getItem('wallet_token')
    } catch (error) {
      console.error('Error loading token:', error)
      return null
    }
  })

  const updateToken = (newToken) => {
    try {
      if (newToken) {
        // ✅ LƯU TRỰC TIẾP - KHÔNG STRINGIFY
        window.localStorage.setItem('wallet_token', newToken)
        setToken(newToken)
      } else {
        window.localStorage.removeItem('wallet_token')
        setToken(null)
      }
    } catch (error) {
      console.error('Error setting token:', error)
    }
  }

  const removeToken = () => {
    try {
      window.localStorage.removeItem('wallet_token')
      setToken(null)
    } catch (error) {
      console.error('Error removing token:', error)
    }
  }

  return [token, updateToken, removeToken]
}

/**
 * Hook để lưu user info
 */
export const useUserStorage = () => {
  return useLocalStorage('wallet_user', null)
}

/**
 * Hook để lưu encrypted seed
 * FIX: Encrypted seed là string, không cần stringify
 */
export const useEncryptedSeed = () => {
  const [seed, setSeed] = useState(() => {
    try {
      return window.localStorage.getItem('wallet_encrypted_seed')
    } catch (error) {
      console.error('Error loading encrypted seed:', error)
      return null
    }
  })

  const updateSeed = (newSeed) => {
    try {
      if (newSeed) {
        window.localStorage.setItem('wallet_encrypted_seed', newSeed)
        setSeed(newSeed)
      } else {
        window.localStorage.removeItem('wallet_encrypted_seed')
        setSeed(null)
      }
    } catch (error) {
      console.error('Error setting encrypted seed:', error)
    }
  }

  const removeSeed = () => {
    try {
      window.localStorage.removeItem('wallet_encrypted_seed')
      setSeed(null)
    } catch (error) {
      console.error('Error removing encrypted seed:', error)
    }
  }

  return [seed, updateSeed, removeSeed]
}

/**
 * Hook để lưu wallet address
 */
export const useWalletAddress = () => {
  const [address, setAddress] = useState(() => {
    try {
      return window.localStorage.getItem('wallet_address')
    } catch (error) {
      console.error('Error loading wallet address:', error)
      return null
    }
  })

  const updateAddress = (newAddress) => {
    try {
      if (newAddress) {
        window.localStorage.setItem('wallet_address', newAddress)
        setAddress(newAddress)
      } else {
        window.localStorage.removeItem('wallet_address')
        setAddress(null)
      }
    } catch (error) {
      console.error('Error setting wallet address:', error)
    }
  }

  const removeAddress = () => {
    try {
      window.localStorage.removeItem('wallet_address')
      setAddress(null)
    } catch (error) {
      console.error('Error removing wallet address:', error)
    }
  }

  return [address, updateAddress, removeAddress]
}

/**
 * Hook để lưu network
 */
export const useNetwork = () => {
  const [network, setNetwork] = useState(() => {
    try {
      return window.localStorage.getItem('wallet_network') || 'sepolia'
    } catch (error) {
      console.error('Error loading network:', error)
      return 'sepolia'
    }
  })

  const updateNetwork = (newNetwork) => {
    try {
      window.localStorage.setItem('wallet_network', newNetwork)
      setNetwork(newNetwork)
    } catch (error) {
      console.error('Error setting network:', error)
    }
  }

  return [network, updateNetwork]
}

export default useLocalStorage

/**
 * useWallet Hook
 * File: src/hooks/useWallet.js
 */

import { useState, useCallback, useEffect } from 'react'
import * as walletApi from '../api/wallet.api'
import * as transactionApi from '../api/transaction.api'
import { useEncryptedSeed, useWalletAddress, useNetwork } from './useLocalStorage'

/**
 * Custom hook để quản lý wallet
 */
export const useWallet = () => {
  const [encryptedSeed, setEncryptedSeed] = useEncryptedSeed()
  const [walletAddress, setWalletAddress] = useWalletAddress()
  const [network, setNetwork] = useNetwork()
  
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState('0')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasWallet, setHasWallet] = useState(!!walletAddress)

  /**
   * Tạo ví mới
   */
  const createWallet = useCallback(async (password, networkType = 'sepolia') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await walletApi.createWallet({
        password,
        network: networkType
      })
      
      // Lưu encrypted seed và address
      setEncryptedSeed(response.encryptedSeed)
      setWalletAddress(response.wallet.address)
      setNetwork(networkType)
      
      // Update state
      setWallet(response.wallet)
      setBalance(response.wallet.balance)
      setHasWallet(true)
      
      // Trả về seed phrase (chỉ hiển thị 1 lần)
      return {
        wallet: response.wallet,
        seedPhrase: response.seedPhrase,
        encryptedSeed: response.encryptedSeed
      }
    } catch (err) {
      setError(err.message || 'Tạo ví thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setEncryptedSeed, setWalletAddress, setNetwork])

  /**
   * Khôi phục ví từ seed phrase
   */
  const restoreWallet = useCallback(async (seedPhrase, password, networkType = 'sepolia') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await walletApi.restoreWallet({
        seedPhrase,
        password,
        network: networkType
      })
      
      // Lưu encrypted seed và address
      setEncryptedSeed(response.encryptedSeed)
      setWalletAddress(response.wallet.address)
      setNetwork(networkType)
      
      // Update state
      setWallet(response.wallet)
      setBalance(response.wallet.balance)
      setHasWallet(true)
      
      return response.wallet
    } catch (err) {
      setError(err.message || 'Khôi phục ví thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setEncryptedSeed, setWalletAddress, setNetwork])

  /**
   * Lấy thông tin ví
   */
  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await walletApi.getWallet()
      
      setWallet(response.wallet)
      setBalance(response.wallet.balance)
      setWalletAddress(response.wallet.address)
      setNetwork(response.wallet.network)
      setHasWallet(true)
      
      return response.wallet
    } catch (err) {
      setError(err.message || 'Lấy thông tin ví thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setWalletAddress, setNetwork])

  /**
   * Cập nhật số dư
   */
  const refreshBalance = useCallback(async () => {
    try {
      const response = await walletApi.updateBalance()
      setBalance(response.balance)
      return response.balance
    } catch (err) {
      console.error('Failed to refresh balance:', err)
      throw err
    }
  }, [])

  /**
   * Chuyển đổi network
   */
  const switchNetwork = useCallback(async (newNetwork) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await walletApi.switchNetwork({ network: newNetwork })
      
      setWallet(response.wallet)
      setBalance(response.wallet.balance)
      setNetwork(newNetwork)
      
      return response.wallet
    } catch (err) {
      setError(err.message || 'Chuyển network thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setNetwork])

  /**
   * Xem lại seed phrase (cần mật khẩu)
   */
  const revealSeedPhrase = useCallback(async (password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await walletApi.revealSeed({
        encryptedSeed,
        password
      })
      
      return response.seedPhrase
    } catch (err) {
      setError(err.message || 'Giải mã seed phrase thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [encryptedSeed])

  /**
   * Gửi ETH
   */
  const sendTransaction = useCallback(async (toAddress, amount, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await transactionApi.sendTransaction({
        toAddress,
        amount,
        encryptedSeed,
        password
      })
      
      // Refresh balance sau khi gửi
      await refreshBalance()
      
      return response.transaction
    } catch (err) {
      setError(err.message || 'Gửi giao dịch thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [encryptedSeed, refreshBalance])

  /**
   * Ước tính phí gas
   */
  const estimateGasFee = useCallback(async (toAddress, amount) => {
    try {
      const response = await transactionApi.estimateFee({
        toAddress,
        amount
      })
      
      return response
    } catch (err) {
      console.error('Failed to estimate gas:', err)
      throw err
    }
  }, [])

  /**
   * Lấy lịch sử giao dịch
   */
  const fetchTransactions = useCallback(async (limit = 20) => {
    try {
      const response = await transactionApi.getTransactionHistory(limit)
      setTransactions(response.transactions)
      return response.transactions
    } catch (err) {
      console.error('Failed to fetch transactions:', err)
      throw err
    }
  }, [])

  /**
   * Lấy giao dịch pending
   */
  const fetchPendingTransactions = useCallback(async () => {
    try {
      const response = await transactionApi.getPendingTransactions()
      return response.transactions
    } catch (err) {
      console.error('Failed to fetch pending transactions:', err)
      throw err
    }
  }, [])

  /**
   * Lấy thống kê giao dịch
   */
  const fetchTransactionStats = useCallback(async () => {
    try {
      const response = await transactionApi.getTransactionStats()
      return response.stats
    } catch (err) {
      console.error('Failed to fetch transaction stats:', err)
      throw err
    }
  }, [])

  /**
   * Export giao dịch ra CSV
   */
  const exportTransactions = useCallback(async () => {
    try {
      await transactionApi.exportTransactions()
      return true
    } catch (err) {
      console.error('Failed to export transactions:', err)
      throw err
    }
  }, [])

  // Auto load wallet nếu có address
  useEffect(() => {
    if (walletAddress && !wallet) {
      fetchWallet()
    }
  }, [walletAddress, wallet, fetchWallet])

  return {
    // State
    wallet,
    balance,
    transactions,
    encryptedSeed,
    walletAddress,
    network,
    loading,
    error,
    hasWallet,
    
    // Wallet Actions
    createWallet,
    restoreWallet,
    fetchWallet,
    refreshBalance,
    switchNetwork,
    revealSeedPhrase,
    
    // Transaction Actions
    sendTransaction,
    estimateGasFee,
    fetchTransactions,
    fetchPendingTransactions,
    fetchTransactionStats,
    exportTransactions,
  }
}

export default useWallet