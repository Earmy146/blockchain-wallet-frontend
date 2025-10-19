/**
 * useAuth Hook
 * File: src/hooks/useAuth.js
 */

import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authApi from '../api/auth.api'
import * as storage from '../utils/storage'
import { useToken, useUserStorage } from './useLocalStorage'

/**
 * Custom hook để quản lý authentication
 */
export const useAuth = () => {
  const navigate = useNavigate()
  
  const [token, setToken] = useToken()
  const [user, setUser] = useUserStorage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)

  /**
   * Đăng ký user mới
   */
  const register = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.register(data)
      
      // Lưu token và user
      setToken(response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      
      return response
    } catch (err) {
      setError(err.message || 'Đăng ký thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setToken, setUser])

  /**
   * Đăng nhập
   */
  const login = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.login(data)
      
      // Lưu token và user
      setToken(response.token)
      setUser(response.user)
      setIsAuthenticated(true)
      
      return response
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setToken, setUser])

  /**
   * Đăng xuất
   */
  const logout = useCallback(() => {
    // Xóa tất cả dữ liệu
    storage.clearAll()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    
    // Redirect về login
    navigate('/login')
  }, [setToken, setUser, navigate])

  /**
   * Verify token khi app khởi động
   */
  const verifyAuth = useCallback(async () => {
    if (!token) {
      setIsAuthenticated(false)
      return false
    }

    try {
      setLoading(true)
      const response = await authApi.verifyToken()
      
      // Token hợp lệ
      setUser(response.user)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      // Token không hợp lệ hoặc hết hạn
      console.error('Token verification failed:', err)
      logout()
      return false
    } finally {
      setLoading(false)
    }
  }, [token, setUser, logout])

  /**
   * Lấy thông tin user mới nhất
   */
  const refreshUser = useCallback(async () => {
    try {
      setLoading(true)
      const response = await authApi.getMe()
      setUser(response.user)
      return response.user
    } catch (err) {
      console.error('Failed to refresh user:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  /**
   * Đổi mật khẩu
   */
  const changePassword = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      await authApi.changePassword(data)
      return true
    } catch (err) {
      setError(err.message || 'Đổi mật khẩu thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Cập nhật profile
   */
  const updateProfile = useCallback(async (data) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authApi.updateProfile(data)
      setUser(response.user)
      
      return response.user
    } catch (err) {
      setError(err.message || 'Cập nhật profile thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [setUser])

  /**
   * Xóa tài khoản
   */
  const deleteAccount = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await authApi.deleteAccount()
      logout()
      
      return true
    } catch (err) {
      setError(err.message || 'Xóa tài khoản thất bại')
      throw err
    } finally {
      setLoading(false)
    }
  }, [logout])

  // Auto verify token khi component mount
  useEffect(() => {
    if (token && !user) {
      verifyAuth()
    }
  }, [token, user, verifyAuth])

  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    register,
    login,
    logout,
    verifyAuth,
    refreshUser,
    changePassword,
    updateProfile,
    deleteAccount,
  }
}

export default useAuth