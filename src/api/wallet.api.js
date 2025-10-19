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