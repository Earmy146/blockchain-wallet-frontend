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