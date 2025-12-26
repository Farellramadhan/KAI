import { api } from './client'

export const locationsAPI = {
  // Get all locations
  getAll: async () => {
    return await api.get('/locations')
  },

  // Get single location by ID
  getById: async (id) => {
    return await api.get(`/locations/${id}`)
  },

  // Create new location (supports FormData for image upload)
  create: async (locationData) => {
    return await api.post('/locations', locationData)
  },

  // Update location (supports FormData for image upload)
  update: async (id, locationData) => {
    return await api.put(`/locations/${id}`, locationData)
  },

  // Delete location
  delete: async (id) => {
    return await api.delete(`/locations/${id}`)
  },

  // Bulk delete locations
  bulkDelete: async (ids) => {
    return await api.post('/locations/bulk-delete', { ids })
  },

  // Search locations
  search: async (query) => {
    return await api.get(`/locations/search?q=${encodeURIComponent(query)}`)
  },

  // Filter locations by category
  filterByCategory: async (category) => {
    return await api.get(`/locations?category=${encodeURIComponent(category)}`)
  },

  // Get location statistics
  getStats: async () => {
    return await api.get('/locations/stats')
  }
}
