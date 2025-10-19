/**
 * Authentication API Functions
 * File: src/api/auth.api.js
 */

import axiosInstance from './axios.config'

/**
 * Đăng ký user mới
 * @param {Object} data - { email, password, confirmPassword }
 * @returns {Promise} - { user, token }
 */
export const register = async (data) => {
  try {
    const response = await axiosInstance.post('/users/register', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Đăng nhập
 * @param {Object} data - { email, password }
 * @returns {Promise} - { user, token }
 */
export const login = async (data) => {
  try {
    const response = await axiosInstance.post('/users/login', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Lấy thông tin user hiện tại
 * @returns {Promise} - { user }
 */
export const getMe = async () => {
  try {
    const response = await axiosInstance.get('/users/me')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Verify token có hợp lệ không
 * @returns {Promise} - { valid, user }
 */
export const verifyToken = async () => {
  try {
    const response = await axiosInstance.get('/users/verify-token')
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Đổi mật khẩu
 * @param {Object} data - { currentPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = async (data) => {
  try {
    const response = await axiosInstance.put('/users/change-password', data)
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Cập nhật profile
 * @param {Object} data - { username }
 * @returns {Promise}
 */
export const updateProfile = async (data) => {
  try {
    const response = await axiosInstance.put('/users/me', data)
    return response.data
  } catch (error) {
    throw error
  }
}

/**
 * Xóa tài khoản
 * @returns {Promise}
 */
export const deleteAccount = async () => {
  try {
    const response = await axiosInstance.delete('/users/me')
    return response
  } catch (error) {
    throw error
  }
}

export default {
  register,
  login,
  getMe,
  verifyToken,
  changePassword,
  updateProfile,
  deleteAccount,
}