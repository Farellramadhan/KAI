// API Client Configuration
// Always hit the same origin (or an explicitly configured one) so cookies work with credentials.
const META_API_BASE =
  document.querySelector('meta[name="api-base-url"]')?.getAttribute('content')
const API_ORIGIN =
  (META_API_BASE && META_API_BASE.replace(/\/$/, '')) ||
  (import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')) ||
  window.location.origin.replace(/\/$/, '')

const API_BASE_URL = `${API_ORIGIN}/api`

export { API_BASE_URL }

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
    'X-Requested-With': 'XMLHttpRequest'
  }

  // Add CSRF token only for non-API routes
  if (!url.includes('/api')) {
    defaultHeaders['X-CSRF-TOKEN'] = getCsrfToken()
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    credentials: 'include' // Important untuk session cookies
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
      // For validation errors, include field errors
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join(', ')
        throw new Error(`${error.message}: ${errorMessages}`)
      }
      throw new Error(error.message || `HTTP Error: ${response.status}`)
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

// Helper untuk request dengan FormData (file upload)
export const apiFormData = async (endpoint, method, formData) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      method,
      body: formData,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    
    if (response.status === 401) {
      window.location.href = '/login'
      throw new Error('Unauthorized')
    }

    if (response.status === 419) {
      throw new Error('Session expired. Please refresh the page.')
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      if (error.errors) {
        const errorMessages = Object.values(error.errors).flat().join(', ')
        throw new Error(`${error.message}: ${errorMessages}`)
      }
      throw new Error(error.message || `HTTP Error: ${response.status}`)
    }

    if (response.status === 204) {
      return null
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

// HTTP Methods helpers
export const api = {
  get: (endpoint, options = {}) => 
    apiClient(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, data, options = {}) => {
    // Support FormData for file uploads
    if (data instanceof FormData) {
      return apiFormData(endpoint, 'POST', data)
    }
    return apiClient(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  put: (endpoint, data, options = {}) => {
    // Support FormData for file uploads (use POST with _method override)
    if (data instanceof FormData) {
      data.append('_method', 'PUT')
      return apiFormData(endpoint, 'POST', data)
    }
    return apiClient(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },
  
  patch: (endpoint, data, options = {}) => 
    apiClient(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    }),
  
  delete: (endpoint, options = {}) => 
    apiClient(endpoint, { ...options, method: 'DELETE' })
}
