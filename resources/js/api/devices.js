import { api } from './client'

export const devicesAPI = {
  // Get all devices
  getAll: async () => {
    return await api.get('/api/devices')
  },

  // Get devices by location
  getByLocation: async (locationId) => {
    return await api.get(`/api/locations/${locationId}/devices`)
  },

  // Get single device by ID
  getById: async (id) => {
    return await api.get(`/api/devices/${id}`)
  },

  // Create new device
  create: async (deviceData) => {
    return await api.post('/api/devices', deviceData)
  },

  // Update device
  update: async (id, deviceData) => {
    return await api.put(`/api/devices/${id}`, deviceData)
  },

  // Delete device
  delete: async (id) => {
    return await api.delete(`/api/devices/${id}`)
  },

  // Update device status
  updateStatus: async (id, status) => {
    return await api.patch(`/api/devices/${id}/status`, { status })
  },

  // Get device statistics
  getStats: async (locationId = null) => {
    const endpoint = locationId 
      ? `/api/devices/stats?location_id=${locationId}`
      : '/api/devices/stats'
    return await api.get(endpoint)
  }
}
