/**
 * Auth Context Provider
 * File: src/context/AuthContext.jsx
 */

import { createContext, useContext } from 'react'
import { useAuth as useAuthHook } from '../hooks/useAuth'

// Tạo context
const AuthContext = createContext(null)

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuthHook()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom hook để sử dụng Auth Context
 * Sử dụng trong components: const { user, login, logout } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  
  return context
}

export default AuthContext