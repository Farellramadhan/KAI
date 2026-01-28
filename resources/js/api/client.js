// API Client Configuration
const API_BASE_URL = window.location.origin

// Helper untuk mendapatkan CSRF token dari meta tag
const getCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')
  return token ? token.getAttribute('content') : ''
}

// Base fetch wrapper dengan error handling
export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-CSRF-TOKEN': getCsrfToken(),
    'X-Requested-With': 'XMLHttpRequest'
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'same-origin' // Important untuk session cookies
  }

  try {
    const response = await fetch(url, config)
    
    // Handle different response statuses
    if (response.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }

    if (response.status === 419) {
      // CSRF token mismatch
      throw new Error('Session expired. Please refresh the page.')
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP Error: ${response.status}`)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// HTTP Methods helpers
export const api = {
  get: (endpoint, options = {}) => 
    apiClient(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => 
    apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    }),
  
  put: (endpoint, data, options = {}) => 
    apiClient(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  
  patch: (endpoint, data, options = {}) => 
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  
  delete: (endpoint, options = {}) => 
    apiClient(endpoint, { ...options, method: 'DELETE' })
}
