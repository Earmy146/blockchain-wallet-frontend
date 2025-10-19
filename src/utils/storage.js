/**
 * LocalStorage Helper Functions
 * File: src/utils/storage.js
 */

const STORAGE_KEYS = {
  TOKEN: 'wallet_token',
  USER: 'wallet_user',
  ENCRYPTED_SEED: 'wallet_encrypted_seed',
  WALLET_ADDRESS: 'wallet_address',
  NETWORK: 'wallet_network',
}

/**
 * Lưu token vào localStorage
 */
export const saveToken = (token) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    return true
  } catch (error) {
    console.error('Error saving token:', error)
    return false
  }
}

/**
 * Lấy token từ localStorage
 */
export const getToken = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  } catch (error) {
    console.error('Error getting token:', error)
    return null
  }
}

/**
 * Xóa token
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    return true
  } catch (error) {
    console.error('Error removing token:', error)
    return false
  }
}

/**
 * Lưu thông tin user
 */
export const saveUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    return true
  } catch (error) {
    console.error('Error saving user:', error)
    return false
  }
}

/**
 * Lấy thông tin user
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER)
    return user ? JSON.parse(user) : null
  } catch (error) {
    console.error('Error getting user:', error)
    return null
  }
}

/**
 * Lưu encrypted seed phrase
 */
export const saveEncryptedSeed = (encryptedSeed) => {
  try {
    localStorage.setItem(STORAGE_KEYS.ENCRYPTED_SEED, encryptedSeed)
    return true
  } catch (error) {
    console.error('Error saving encrypted seed:', error)
    return false
  }
}

/**
 * Lấy encrypted seed phrase
 */
export const getEncryptedSeed = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.ENCRYPTED_SEED)
  } catch (error) {
    console.error('Error getting encrypted seed:', error)
    return null
  }
}

/**
 * Lưu địa chỉ ví
 */
export const saveWalletAddress = (address) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address)
    return true
  } catch (error) {
    console.error('Error saving wallet address:', error)
    return false
  }
}

/**
 * Lấy địa chỉ ví
 */
export const getWalletAddress = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS)
  } catch (error) {
    console.error('Error getting wallet address:', error)
    return null
  }
}

/**
 * Lưu network
 */
export const saveNetwork = (network) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NETWORK, network)
    return true
  } catch (error) {
    console.error('Error saving network:', error)
    return false
  }
}

/**
 * Lấy network
 */
export const getNetwork = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.NETWORK) || 'sepolia'
  } catch (error) {
    console.error('Error getting network:', error)
    return 'sepolia'
  }
}

/**
 * Xóa TẤT CẢ dữ liệu (logout)
 */
export const clearAll = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    return true
  } catch (error) {
    console.error('Error clearing storage:', error)
    return false
  }
}

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = () => {
  return !!getToken()
}

/**
 * Kiểm tra đã có ví chưa
 */
export const hasWallet = () => {
  return !!getWalletAddress() && !!getEncryptedSeed()
}

export default {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  saveEncryptedSeed,
  getEncryptedSeed,
  saveWalletAddress,
  getWalletAddress,
  saveNetwork,
  getNetwork,
  clearAll,
  isAuthenticated,
  hasWallet,
}