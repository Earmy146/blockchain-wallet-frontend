/**
 * Formatter Utility Functions
 * File: src/utils/formatter.js
 */

/**
 * Format số ETH (làm tròn 6 chữ số thập phân)
 */
export const formatEth = (amount) => {
  if (!amount) return '0.000000'
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.000000'
  return num.toFixed(6)
}

/**
 * Format số ETH ngắn gọn (4 chữ số)
 */
export const formatEthShort = (amount) => {
  if (!amount) return '0.0000'
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.0000'
  return num.toFixed(4)
}

/**
 * Format địa chỉ Ethereum (rút gọn giữa)
 * 0x1234...5678
 */
export const formatAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return ''
  if (address.length < startChars + endChars) return address
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

/**
 * Format transaction hash (rút gọn)
 */
export const formatTxHash = (hash, startChars = 10, endChars = 8) => {
  if (!hash) return ''
  if (hash.length < startChars + endChars) return hash
  return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`
}

/**
 * Format date (DD/MM/YYYY HH:mm)
 */
export const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Format date relative (5 phút trước, 2 giờ trước, ...)
 */
export const formatDateRelative = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  
  const diffMs = now - d
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  
  if (diffSec < 60) return 'Vừa xong'
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  if (diffDay < 7) return `${diffDay} ngày trước`
  
  return formatDate(date)
}

/**
 * Format số lớn (1000 → 1K, 1000000 → 1M)
 */
export const formatNumber = (num) => {
  if (!num) return '0'
  
  const n = parseFloat(num)
  if (isNaN(n)) return '0'
  
  if (n >= 1000000) {
    return (n / 1000000).toFixed(2) + 'M'
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(2) + 'K'
  }
  
  return n.toFixed(2)
}

/**
 * Format gas price (gwei)
 */
export const formatGasPrice = (gwei) => {
  if (!gwei) return '0 Gwei'
  const num = parseFloat(gwei)
  if (isNaN(num)) return '0 Gwei'
  return `${num.toFixed(2)} Gwei`
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback cho trình duyệt cũ
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    return false
  }
}

/**
 * Get explorer URL cho transaction
 */
export const getExplorerTxUrl = (txHash, network = 'sepolia') => {
  const explorers = {
    sepolia: 'https://sepolia.etherscan.io',
    mainnet: 'https://etherscan.io'
  }
  
  const baseUrl = explorers[network] || explorers.sepolia
  return `${baseUrl}/tx/${txHash}`
}

/**
 * Get explorer URL cho address
 */
export const getExplorerAddressUrl = (address, network = 'sepolia') => {
  const explorers = {
    sepolia: 'https://sepolia.etherscan.io',
    mainnet: 'https://etherscan.io'
  }
  
  const baseUrl = explorers[network] || explorers.sepolia
  return `${baseUrl}/address/${address}`
}

/**
 * Truncate text (rút gọn văn bản)
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export default {
  formatEth,
  formatEthShort,
  formatAddress,
  formatTxHash,
  formatDate,
  formatDateRelative,
  formatNumber,
  formatGasPrice,
  copyToClipboard,
  getExplorerTxUrl,
  getExplorerAddressUrl,
  truncateText,
}

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

/**
 * Validation Utility Functions
 * File: src/utils/validation.js
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password (min 8 characters, có chữ hoa, chữ thường, số)
 */
export const isValidPassword = (password) => {
  if (password.length < 8) return false
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  
  return hasUpperCase && hasLowerCase && hasNumber
}

/**
 * Validate Ethereum address (0x + 40 hex characters)
 */
export const isValidAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate seed phrase (12 từ, cách nhau bởi space)
 */
export const isValidSeedPhrase = (seedPhrase) => {
  if (!seedPhrase || typeof seedPhrase !== 'string') {
    return false
  }
  
  const words = seedPhrase.trim().split(/\s+/)
  return words.length === 12 && words.every(word => word.length > 0)
}

/**
 * Validate amount (phải là số > 0)
 */
export const isValidAmount = (amount) => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0 && isFinite(num)
}

/**
 * Validate transaction hash
 */
export const isValidTxHash = (txHash) => {
  return /^0x[a-fA-F0-9]{64}$/.test(txHash)
}

/**
 * Get password strength (0-4)
 * 0: Very Weak
 * 1: Weak
 * 2: Medium
 * 3: Strong
 * 4: Very Strong
 */
export const getPasswordStrength = (password) => {
  let strength = 0
  
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++
  
  return Math.min(strength, 4)
}

/**
 * Get password strength text
 */
export const getPasswordStrengthText = (strength) => {
  const texts = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh']
  return texts[strength] || 'Rất yếu'
}

/**
 * Get password strength color (for Tailwind)
 */
export const getPasswordStrengthColor = (strength) => {
  const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500']
  return colors[strength] || 'text-red-500'
}

/**
 * Validate form errors
 */
export const validateRegisterForm = ({ email, password, confirmPassword }) => {
  const errors = {}
  
  if (!email) {
    errors.email = 'Email là bắt buộc'
  } else if (!isValidEmail(email)) {
    errors.email = 'Email không hợp lệ'
  }
  
  if (!password) {
    errors.password = 'Mật khẩu là bắt buộc'
  } else if (!isValidPassword(password)) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số'
  }
  
  if (!confirmPassword) {
    errors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc'
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
  }
  
  return errors
}

/**
 * Validate send transaction form
 */
export const validateSendForm = ({ toAddress, amount, password }) => {
  const errors = {}
  
  if (!toAddress) {
    errors.toAddress = 'Địa chỉ người nhận là bắt buộc'
  } else if (!isValidAddress(toAddress)) {
    errors.toAddress = 'Địa chỉ Ethereum không hợp lệ'
  }
  
  if (!amount) {
    errors.amount = 'Số tiền là bắt buộc'
  } else if (!isValidAmount(amount)) {
    errors.amount = 'Số tiền phải lớn hơn 0'
  }
  
  if (!password) {
    errors.password = 'Mật khẩu là bắt buộc'
  }
  
  return errors
}

export default {
  isValidEmail,
  isValidPassword,
  isValidAddress,
  isValidSeedPhrase,
  isValidAmount,
  isValidTxHash,
  getPasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
  validateRegisterForm,
  validateSendForm,
}