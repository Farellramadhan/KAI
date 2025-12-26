import { api, apiFormData, API_BASE_URL } from './client'

export const devicesAPI = {
  // Get all devices
  getAll: async () => {
    return await api.get('/devices')
  },

  // Get devices by location
  getByLocation: async (locationId) => {
    return await api.get(`/locations/${locationId}/devices`)
  },

  // Get single device by ID
  getById: async (id) => {
    return await api.get(`/devices/${id}`)
  },

  // Create new device
  create: async (deviceData) => {
    return await api.post('/devices', deviceData)
  },

  // Update device
  update: async (id, deviceData) => {
    return await api.put(`/devices/${id}`, deviceData)
  },

  // Delete device
  delete: async (id) => {
    return await api.delete(`/devices/${id}`)
  },

  // Bulk delete devices
  bulkDelete: async (ids) => {
    return await api.post('/devices/bulk-delete', { ids })
  },

  // Bulk import devices from CSV/Excel
  bulkImport: async (locationId, file) => {
    const formData = new FormData()
    formData.append('location_id', locationId)
    formData.append('file', file)
    return await apiFormData('/devices/bulk-import', 'POST', formData)
  },

  // Download import template
  downloadTemplate: async () => {
    const response = await fetch(`${API_BASE_URL}/devices/import-template`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })

    if (!response.ok) {
      throw new Error('Gagal mengunduh template import')
    }

    return await response.blob()
  },

  // Update device status
  updateStatus: async (id, status) => {
    return await api.patch(`/devices/${id}/status`, { status })
  },

  // Get device statistics
  getStats: async (locationId = null) => {
    const endpoint = locationId 
      ? `/devices/stats?location_id=${locationId}`
      : '/devices/stats'
    return await api.get(endpoint)
  }
}
