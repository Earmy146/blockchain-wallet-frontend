/**
 * useLocalStorage Hook
 * File: src/hooks/useLocalStorage.js
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
 */
export const useToken = () => {
  return useLocalStorage('wallet_token', null)
}

/**
 * Hook để lưu user info
 */
export const useUserStorage = () => {
  return useLocalStorage('wallet_user', null)
}

/**
 * Hook để lưu encrypted seed
 */
export const useEncryptedSeed = () => {
  return useLocalStorage('wallet_encrypted_seed', null)
}

/**
 * Hook để lưu wallet address
 */
export const useWalletAddress = () => {
  return useLocalStorage('wallet_address', null)
}

/**
 * Hook để lưu network
 */
export const useNetwork = () => {
  return useLocalStorage('wallet_network', 'sepolia')
}

export default useLocalStorage