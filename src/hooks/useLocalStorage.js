/**
 * useLocalStorage Hook
 * File: src/hooks/useLocalStorage.js
 * 
 * FIX: Không stringify token (JWT string)
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
 * FIX: Token là string, không cần JSON.stringify
 */
export const useToken = () => {
  const [token, setToken] = useState(() => {
    try {
      // ✅ LẤY TRỰC TIẾP - KHÔNG PARSE JSON
      return window.localStorage.getItem('wallet_token')
    } catch (error) {
      console.error('Error loading token:', error)
      return null
    }
  })

  const updateToken = (newToken) => {
    try {
      if (newToken) {
        // ✅ LƯU TRỰC TIẾP - KHÔNG STRINGIFY
        window.localStorage.setItem('wallet_token', newToken)
        setToken(newToken)
      } else {
        window.localStorage.removeItem('wallet_token')
        setToken(null)
      }
    } catch (error) {
      console.error('Error setting token:', error)
    }
  }

  const removeToken = () => {
    try {
      window.localStorage.removeItem('wallet_token')
      setToken(null)
    } catch (error) {
      console.error('Error removing token:', error)
    }
  }

  return [token, updateToken, removeToken]
}

/**
 * Hook để lưu user info
 */
export const useUserStorage = () => {
  return useLocalStorage('wallet_user', null)
}

/**
 * Hook để lưu encrypted seed
 * FIX: Encrypted seed là string, không cần stringify
 */
export const useEncryptedSeed = () => {
  const [seed, setSeed] = useState(() => {
    try {
      return window.localStorage.getItem('wallet_encrypted_seed')
    } catch (error) {
      console.error('Error loading encrypted seed:', error)
      return null
    }
  })

  const updateSeed = (newSeed) => {
    try {
      if (newSeed) {
        window.localStorage.setItem('wallet_encrypted_seed', newSeed)
        setSeed(newSeed)
      } else {
        window.localStorage.removeItem('wallet_encrypted_seed')
        setSeed(null)
      }
    } catch (error) {
      console.error('Error setting encrypted seed:', error)
    }
  }

  const removeSeed = () => {
    try {
      window.localStorage.removeItem('wallet_encrypted_seed')
      setSeed(null)
    } catch (error) {
      console.error('Error removing encrypted seed:', error)
    }
  }

  return [seed, updateSeed, removeSeed]
}

/**
 * Hook để lưu wallet address
 */
export const useWalletAddress = () => {
  const [address, setAddress] = useState(() => {
    try {
      return window.localStorage.getItem('wallet_address')
    } catch (error) {
      console.error('Error loading wallet address:', error)
      return null
    }
  })

  const updateAddress = (newAddress) => {
    try {
      if (newAddress) {
        window.localStorage.setItem('wallet_address', newAddress)
        setAddress(newAddress)
      } else {
        window.localStorage.removeItem('wallet_address')
        setAddress(null)
      }
    } catch (error) {
      console.error('Error setting wallet address:', error)
    }
  }

  const removeAddress = () => {
    try {
      window.localStorage.removeItem('wallet_address')
      setAddress(null)
    } catch (error) {
      console.error('Error removing wallet address:', error)
    }
  }

  return [address, updateAddress, removeAddress]
}

/**
 * Hook để lưu network
 */
export const useNetwork = () => {
  const [network, setNetwork] = useState(() => {
    try {
      return window.localStorage.getItem('wallet_network') || 'sepolia'
    } catch (error) {
      console.error('Error loading network:', error)
      return 'sepolia'
    }
  })

  const updateNetwork = (newNetwork) => {
    try {
      window.localStorage.setItem('wallet_network', newNetwork)
      setNetwork(newNetwork)
    } catch (error) {
      console.error('Error setting network:', error)
    }
  }

  return [network, updateNetwork]
}

export default useLocalStorage