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