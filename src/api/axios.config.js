/**
 * Axios Configuration
 * File: src/api/axios.config.js
 */

import axios from 'axios'
import { getToken, removeToken } from '../utils/storage'

// Lấy API URL từ .env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url)
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response Interceptor - Xử lý response và errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response (chỉ trong development)
    if (import.meta.env.DEV) {
      console.log('✅ Response:', response.config.url, response.data)
    }
    
    return response.data
  },
  (error) => {
    // Log error
    console.error('❌ API Error:', error.response?.data || error.message)
    
    // Xử lý các loại lỗi
    if (error.response) {
      const { status, data } = error.response
      
      // 401 Unauthorized - Token hết hạn hoặc không hợp lệ
      if (status === 401) {
        removeToken()
        
        // Redirect về login (nếu không phải đang ở trang login)
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      }
      
      // 403 Forbidden
      if (status === 403) {
        console.error('Access denied')
      }
      
      // 404 Not Found
      if (status === 404) {
        console.error('Resource not found')
      }
      
      // 429 Too Many Requests
      if (status === 429) {
        console.error('Rate limit exceeded')
      }
      
      // 500 Internal Server Error
      if (status === 500) {
        console.error('Server error')
      }
      
      // Trả về error message từ backend
      return Promise.reject({
        status,
        message: data.message || 'Đã có lỗi xảy ra',
        errors: data.errors || null,
      })
    }
    
    // Network Error (không kết nối được backend)
    if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.',
      })
    }
    
    // Lỗi khác
    return Promise.reject({
      status: 0,
      message: error.message || 'Đã có lỗi xảy ra',
    })
  }
)

export default axiosInstance