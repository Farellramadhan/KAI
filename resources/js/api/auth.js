import { api } from './client'

export const authAPI = {
  // Login user
  login: async (credentials) => {
    return await api.post('/login', credentials)
  },

  // Register new user
  register: async (userData) => {
    return await api.post('/register', userData)
  },

  // Logout user
  logout: async () => {
    return await api.post('/logout')
  },

  // Get current authenticated user
  getUser: async () => {
    return await api.get('/user')
  },

  // Request password reset code
  forgotPassword: async (data) => {
    return await api.post('/forgot-password', data)
  },

  // Verify reset code
  verifyResetCode: async (data) => {
    return await api.post('/verify-reset-code', data)
  },

  // Reset password with code
  resetPassword: async (data) => {
    return await api.post('/reset-password', data)
  }
}
