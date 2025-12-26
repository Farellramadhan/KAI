import { api } from './client'

export const locationsAPI = {
  // Get all locations
  getAll: async () => {
    return await api.get('/api/locations')
  },

  // Get single location by ID
  getById: async (id) => {
    return await api.get(`/api/locations/${id}`)
  },

  // Create new location
  create: async (locationData) => {
    return await api.post('/api/locations', locationData)
  },

  // Update location
  update: async (id, locationData) => {
    return await api.put(`/api/locations/${id}`, locationData)
  },

  // Delete location
  delete: async (id) => {
    return await api.delete(`/api/locations/${id}`)
  },

  // Search locations
  search: async (query) => {
    return await api.get(`/api/locations/search?q=${encodeURIComponent(query)}`)
  },

  // Filter locations by category
  filterByCategory: async (category) => {
    return await api.get(`/api/locations?category=${encodeURIComponent(category)}`)
  }
}
