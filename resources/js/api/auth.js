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
    return await api.get('/logout')
  },

  // Get current authenticated user
  getUser: async () => {
    return await api.get('/api/user')
  }
}
