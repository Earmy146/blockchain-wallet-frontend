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