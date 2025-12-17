/**
 * Authentication API Functions
 * File: src/api/auth.api.js
 */

import axiosInstance from './axios.config'

/**
 * Đăng ký user mới
 * @param {Object} data - { email, password, confirmPassword }
 * @returns {Promise} - { user, token }
 */
export const register = async (data) => {
  try {
    const response = await axiosInstance.post('/users/register', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Đăng nhập
 * @param {Object} data - { email, password }
 * @returns {Promise} - { user, token }
 */
export const login = async (data) => {
  try {
    const response = await axiosInstance.post('/users/login', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise} - { user }
 */
export const getMe = async () => {
  try {
    const response = await axiosInstance.get('/users/me')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Verify token có hợp lệ không
 * @returns {Promise} - { valid, user }
 */
export const verifyToken = async () => {
  try {
    const response = await axiosInstance.get('/users/verify-token')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Đổi mật khẩu
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.put('/users/change-password', data)
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Cập nhật profile
 * @param {Object} data - { username }
 * @returns {Promise}
 */
export const updateProfile = async (data) => {
  try {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Xóa tài khoản
 * @returns {Promise}
 */
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete('/users/me')
    return response
  } catch (error) {
    throw error
  }
}

export default {
  register,
  login,
  getMe,
  verifyToken,
  changePassword,
  updateProfile,
  deleteAccount,
}
/**
 * Axios Configuration
 * File: src/api/axios.config.js
 */

import axios from 'axios'
import { getToken, removeToken } from '../utils/storage'

// Lấy API URL từ .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, response.data)
    }
    
    return response.data
  },
  (error) => {
    // Log error
    console.error('❌ API Error:', error.response?.data || error.message)
    
    // Xử lý các loại lỗi
    if (error.response) {
      const { status, data } = error.response
      
      // 401 Unauthorized - Token hết hạn hoặc không hợp lệ
      if (status === 401) {
        removeToken()
        
        // Redirect về login (nếu không phải đang ở trang login)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
      
      // 403 Forbidden
      if (status === 403) {
        console.error('Access denied')
      }
      
      // 404 Not Found
      if (status === 404) {
        console.error('Resource not found')
      }
      
      // 429 Too Many Requests
      if (status === 429) {
        console.error('Rate limit exceeded')
      }
      
      // 500 Internal Server Error
      if (status === 500) {
        console.error('Server error')
      }
      
      // Trả về error message từ backend
      return Promise.reject({
        status,
        message: data.message || 'Đã có lỗi xảy ra',
        errors: data.errors || null,
      })
    }
    
    // Network Error (không kết nối được backend)
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      })
    }
    
    // Lỗi khác
    return Promise.reject({
      status: 0,
      message: error.message || 'Đã có lỗi xảy ra',
    })
  }
)

export default axiosInstance

/**
 * Transaction API Functions
 * File: src/api/transaction.api.js
 */

import axiosInstance from './axios.config'

/**
 * Gửi ETH
 * @param {Object} data - { toAddress, amount, encryptedSeed, password }
 * @returns {Promise} - { transaction }
 */
export const sendTransaction = async (data) => {
  try {
    const response = await axiosInstance.post('/transactions/send', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Ước tính phí gas
 * @param {Object} data - { toAddress, amount }
 * @returns {Promise} - { gasLimit, gasPrice, estimatedFee, totalAmount }
 */
export const estimateFee = async (data) => {
  try {
    const response = await axiosInstance.post('/transactions/estimate-fee', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy lịch sử giao dịch
 * @param {Number} limit - Số lượng giao dịch
 * @returns {Promise} - { transactions, count }
 */
export const getTransactionHistory = async (limit = 20) => {
  try {
    const response = await axiosInstance.get('/transactions/history', {
      params: { limit }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy chi tiết giao dịch
 * @param {String} id - Transaction ID
 * @returns {Promise} - { transaction }
 */
export const getTransactionDetail = async (id) => {
  try {
    const response = await axiosInstance.get(`/transactions/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy giao dịch đang pending
 * @returns {Promise} - { transactions, count }
 */
export const getPendingTransactions = async () => {
  try {
    const response = await axiosInstance.get('/transactions/pending')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy thống kê giao dịch
 * @returns {Promise} - { stats }
 */
export const getTransactionStats = async () => {
  try {
    const response = await axiosInstance.get('/transactions/stats')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Kiểm tra trạng thái giao dịch theo txHash
 * @param {String} txHash - Transaction hash
 * @param {String} network - sepolia/mainnet
 * @returns {Promise} - { txHash, status, from, to, value, blockNumber }
 */
export const checkTransactionStatus = async (txHash, network = 'sepolia') => {
  try {
    const response = await axiosInstance.get(`/transactions/check/${txHash}`, {
      params: { network }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy giao dịch theo địa chỉ
 * @param {String} address - Địa chỉ ví
 * @param {Object} params - { limit, type }
 * @returns {Promise} - { address, transactions, count }
 */
export const getTransactionsByAddress = async (address, params = {}) => {
  try {
    const response = await axiosInstance.get(`/transactions/address/${address}`, {
      params
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Export lịch sử giao dịch (CSV)
 * @returns {Promise} - CSV file
 */
export const exportTransactions = async () => {
  try {
    const response = await axiosInstance.get('/transactions/export', {
      responseType: 'blob'
    })
    
    // Tạo link download
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `transactions_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    
    return true
  } catch (error) {
    throw error
  }
}

/**
 * Lấy gas price hiện tại
 * @param {String} network - sepolia/mainnet
 * @returns {Promise} - { network, gasPrice, gasPriceGwei }
 */
export const getCurrentGasPrice = async (network = 'sepolia') => {
  try {
    const response = await axiosInstance.get('/transactions/gas-price', {
      params: { network }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export default {
  sendTransaction,
  estimateFee,
  getTransactionHistory,
  getTransactionDetail,
  getPendingTransactions,
  getTransactionStats,
  checkTransactionStatus,
  getTransactionsByAddress,
  exportTransactions,
  getCurrentGasPrice,
}

/**
 * Wallet API Functions
 * File: src/api/wallet.api.js
 */

import axiosInstance from './axios.config'

/**
 * Tạo ví mới
 * @param {Object} data - { password, network }
 * @returns {Promise} - { wallet, encryptedSeed, seedPhrase }
 */
export const createWallet = async (data) => {
  try {
    const response = await axiosInstance.post('/wallet/create', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Khôi phục ví từ seed phrase
 * @param {Object} data - { seedPhrase, password, network }
 * @returns {Promise} - { wallet, encryptedSeed }
 */
export const restoreWallet = async (data) => {
  try {
    const response = await axiosInstance.post('/wallet/restore', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy thông tin ví
 * @returns {Promise} - { wallet }
 */
export const getWallet = async () => {
  try {
    const response = await axiosInstance.get('/wallet')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Cập nhật số dư ví
 * @returns {Promise} - { address, balance, network }
 */
export const updateBalance = async () => {
  try {
    const response = await axiosInstance.get('/wallet/balance')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy số dư theo địa chỉ (không cần auth)
 * @param {String} address - Địa chỉ ví
 * @param {String} network - sepolia/mainnet
 * @returns {Promise} - { address, balance, network }
 */
export const getBalance = async (address, network = 'sepolia') => {
  try {
    const response = await axiosInstance.get(`/wallet/balance/${address}`, {
      params: { network }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Verify seed phrase
 * @param {Object} data - { seedPhrase }
 * @returns {Promise} - { valid, address }
 */
export const verifySeed = async (data) => {
  try {
    const response = await axiosInstance.post('/wallet/verify-seed', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Xem lại seed phrase (cần mật khẩu)
 * @param {Object} data - { encryptedSeed, password }
 * @returns {Promise} - { seedPhrase }
 */
export const revealSeed = async (data) => {
  try {
    const response = await axiosInstance.post('/wallet/reveal-seed', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Chuyển đổi network
 * @param {Object} data - { network }
 * @returns {Promise} - { wallet }
 */
export const switchNetwork = async (data) => {
  try {
    const response = await axiosInstance.put('/wallet/switch-network', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy thông tin network hiện tại
 * @returns {Promise} - { network, networkName, chainId, currentBlock, explorer }
 */
export const getNetworkInfo = async () => {
  try {
    const response = await axiosInstance.get('/wallet/network-info')
    return response.data
  } catch (error) {
    throw error
  }
}

export default {
  createWallet,
  restoreWallet,
  getWallet,
  updateBalance,
  getBalance,
  verifySeed,
  revealSeed,
  switchNetwork,
  getNetworkInfo,
}