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