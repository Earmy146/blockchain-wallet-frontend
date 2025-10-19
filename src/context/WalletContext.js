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