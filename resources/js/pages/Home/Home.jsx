import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Input, Loading, MapPicker, Badge, Card } from '../../components'
import { useToast } from '../../components/Toast'
import { locationsAPI } from '../../api'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './Home.css'

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom markers
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showMobileList, setShowMobileList] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccessLoading, setShowSuccessLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    category: 'stasiun',
    code: '',
    image: null,
    imagePreview: null
  })
  const mapRef = useRef(null)
  const markerRefs = useRef({})

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        const data = await locationsAPI.getAll()
        
        // Transform API data to match component format
        const transformedLocations = data.map(loc => ({
          id: loc.id,
          position: [parseFloat(loc.latitude), parseFloat(loc.longitude)],
          name: loc.name,
          code: loc.code,
          type: getTypeFromCategory(loc.category),
          category: loc.category,
          totalPerangkat: loc.devices_count || 0,
          details: loc.description || ''
        }))
        
        setLocations(transformedLocations)
        setError(null)
      } catch (err) {
        setError('Gagal Memuat Data Lokasi. Silakan Refresh Halaman.')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [])

  // Get automatic marker type based on category
  const getTypeFromCategory = (category) => {
    const types = {
      stasiun: 'green',
      kantor: 'red',
      gudang: 'yellow',
      pjl: 'blue'
    }
    return types[category] || 'green'
  }

  // Get welcome name from user data
  const welcomeName = user?.name || 'Pengguna'

  // Koordinat Yogyakarta
  const center = [-7.7956, 110.3695]

  const filteredLocations = locations.filter(loc => {
    // Ketika ada search query, abaikan category filter dan hanya gunakan search
    if (searchQuery.trim()) {
      return loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    }
    // Ketika tidak ada search query, gunakan category filter
    const matchesCategory = activeCategory === 'all' || loc.category === activeCategory
    return matchesCategory
  })

  // Show mobile list when there's a search query
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setShowMobileList(searchQuery.trim().length > 0)
    }
  }, [searchQuery])

  // Auto zoom ketika search query berubah
  React.useEffect(() => {
    if (searchQuery.trim() && filteredLocations.length > 0 && mapRef.current) {
      // Jika hanya 1 hasil, zoom ke lokasi tersebut dengan level 18
      if (filteredLocations.length === 1) {
        mapRef.current.flyTo(filteredLocations[0].position, 18, { duration: 1.5 })
      } else {
        // Jika lebih dari 1, zoom ke kawasan yang mencakup semua hasil
        const bounds = L.latLngBounds(filteredLocations.map(loc => loc.position))
        mapRef.current.fitBounds(bounds, { padding: [100, 100], maxZoom: 17, duration: 1.5 })
      }
    }
  }, [searchQuery, filteredLocations])

  const handleLocationClick = (location) => {
    if (mapRef.current) {
      mapRef.current.flyTo(location.position, 16, { duration: 1.5 })
      
      // Open the marker popup after a short delay to allow zoom animation
      setTimeout(() => {
        const marker = markerRefs.current[location.id]
        if (marker) {
          marker.openPopup()
        }
      }, 500)
    }
    
    // Close desktop search panel
    setSearchOpen(false)
    
    // Close mobile search results list
    setShowMobileList(false)
  }

  const handleCategoryFilter = (category) => {
    // On desktop, clicking the already-active category should toggle it off
    // (show all). On mobile, keep the direct selection behavior.
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setActiveCategory(prev => (prev === category ? 'all' : category))
    } else {
      setActiveCategory(category)
    }

    // Navigate map to show locations of this category
    if (mapRef.current && locations.length > 0) {
      const categoryLocations = category === 'all' 
        ? locations 
        : locations.filter(loc => loc.category === category)

      if (categoryLocations.length > 0) {
        // Calculate bounds for all locations in this category
        const bounds = L.latLngBounds(
          categoryLocations.map(loc => [loc.position[0], loc.position[1]])
        )

        // Fit map to bounds with some padding
        mapRef.current.fitBounds(bounds, { 
          padding: [20, 20],
          maxZoom: 15 // Don't zoom in too much
        })
      }
    }

    // Close mobile search results list
    setShowMobileList(false)
  }

  // Get automatic code based on category
  const getCodeFromCategory = (category) => {
    const codes = {
      stasiun: 'STN',
      kantor: 'KTR',
      gudang: 'GDG',
      pjl: 'PJL'
    }
    return codes[category] || 'LOC'
  }

  const handleAddLocation = async () => {
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast.warning('Silakan isi semua field yang wajib!')
      return
    }

    try {
      // Use FormData for file upload support
      const locationFormData = new FormData()
      locationFormData.append('name', formData.name)
      locationFormData.append('latitude', parseFloat(formData.latitude))
      locationFormData.append('longitude', parseFloat(formData.longitude))
      locationFormData.append('category', formData.category)
      locationFormData.append('code', formData.code || getCodeFromCategory(formData.category))
      locationFormData.append('description', 'Lokasi baru')
      
      if (formData.image) {
        locationFormData.append('image', formData.image)
      }

      const newLocation = await locationsAPI.create(locationFormData)
      
      // Transform and add to local state
      const transformedLocation = {
        id: newLocation.id,
        position: [parseFloat(newLocation.latitude), parseFloat(newLocation.longitude)],
        name: newLocation.name,
        code: newLocation.code,
        type: getTypeFromCategory(newLocation.category),
        category: newLocation.category,
        totalPerangkat: 0,
        details: newLocation.description || 'Lokasi baru'
      }

      setLocations([...locations, transformedLocation])
      
      // Reset form
      setFormData({
        name: '',
        latitude: '',
        longitude: '',
        category: 'stasiun',
        code: '',
        image: null,
        imagePreview: null
      })
      setShowLocationModal(false)
      
      // Show success loading screen
      setShowSuccessLoading(true)
    } catch (err) {
      toast.error('Gagal menambahkan lokasi: ' + err.message)
    }
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        category: value,
        code: getCodeFromCategory(value) // Auto-update code when category changes
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.warning('Silakan pilih file gambar!')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.warning('Ukuran gambar maksimal 5MB!')
        return
      }
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const removeImage = () => {
    if (formData.imagePreview) {
      URL.revokeObjectURL(formData.imagePreview)
    }
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }))
  }

  const MapController = () => {
    const map = useMap()
    mapRef.current = map
    return null
  }

  return (
    <>
      {loading ? (
        <Loading message="Memuat Lokasi..." />
      ) : (
        <div className="home-container">
          {/* Header */}
          <header className="header">
        <div className="header-left">
          <h1 className="welcome-text">Selamat Datang {welcomeName}!</h1>
        </div>
        <div className="header-right">
          <Button 
            variant="ghost" 
            className="user-button" 
            onClick={() => setMenuOpen(!menuOpen)}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          {menuOpen && (
            <div className="dropdown-menu">
              <div className="profile-info">
                <div className="profile-avatar-desktop">
                  {welcomeName.charAt(0).toUpperCase()}
                </div>
                <div className="profile-details">
                  <p className="profile-name">{welcomeName}</p>
                  <p className="profile-email">{user?.email || 'user@kai.id'}</p>
                </div>
              </div>
              <Button 
                variant="danger" 
                className="logout-btn" 
                onClick={onLogout}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                Keluar
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container" onClick={() => window.location.reload()}>
          <img src="/image/logo.png" alt="KAI Logo" className="logo-icon" />
        </div>

        <button className={`search-sidebar-btn ${searchOpen ? 'active' : ''}`} onClick={() => setSearchOpen(!searchOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Search</span>
        </button>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeCategory === 'stasiun' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('stasiun')}
          >
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Stasiun</span>
          </button>

          <button 
            className={`nav-item ${activeCategory === 'kantor' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('kantor')}
          >
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Kantor</span>
          </button>

          <button 
            className={`nav-item ${activeCategory === 'gudang' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('gudang')}
          >
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>Gudang</span>
          </button>

          <button 
            className={`nav-item ${activeCategory === 'pjl' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('pjl')}
          >
            <div className="icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 3v18M3 9h18M3 15h18M15 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span>PJL</span>
          </button>
        </nav>

        {/* Add Location Button in Sidebar */}
        <Button 
          variant="success"
          className="add-location-sidebar-btn"
          onClick={() => setShowLocationModal(true)}
          title="Tambah Lokasi Baru"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        >
          <span>Tambah Lokasi</span>
        </Button>
      </aside>

      {/* Map Content */}
      <main className="main-content">
        {/* Mobile Search Bar */}
        <div className="mobile-search-bar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            placeholder="Cari Lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mobile-search-input"
          />
        </div>

        {/* Mobile Profile Button - Separate */}
        <div className="profile-menu-wrapper-mobile">
          <button className="profile-mobile-btn-map" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {profileMenuOpen && (
            <div className="profile-dropdown-map">
              <div className="profile-header-mobile">
                <div className="profile-avatar-mobile">
                  {welcomeName.charAt(0).toUpperCase()}
                </div>
                <div className="profile-text-mobile">
                  <p className="profile-name">{welcomeName}</p>
                  <p className="profile-email">{user?.email || 'user@kai.id'}</p>
                </div>
              </div>
              <Button 
                variant="danger" 
                className="logout-btn" 
                onClick={onLogout}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                Keluar
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Search Results List */}
        {showMobileList && searchQuery && (
          <div className="mobile-search-results">
            <div className="mobile-results-header">
              <span className="results-count">{filteredLocations.length} hasil ditemukan</span>
              <button className="close-results" onClick={() => setShowMobileList(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="mobile-results-list">
              {filteredLocations.map(location => (
                <div 
                  key={location.id} 
                  className="mobile-result-item"
                  onClick={() => handleLocationClick(location)}
                >
                  <div className={`marker-indicator ${location.type}`}></div>
                  <div className="result-info">
                    <div className="result-name">
                      {location.name}
                      {location.code && <span style={{ marginLeft: '6px', fontWeight: '500', color: 'var(--primary)', fontSize: '12px' }}>({location.code})</span>}
                    </div>
                    <div className="result-details">
                      <span className="result-category">{location.category}</span>
                      <span className="result-separator">•</span>
                      <span className="result-devices">{location.totalPerangkat} perangkat</span>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="arrow-icon">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Filter Bar */}
        <div className="mobile-filter-bar">
          <button 
            className={`filter-bubble ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('all')}
          >
            Semua
          </button>
          <button 
            className={`filter-bubble ${activeCategory === 'stasiun' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('stasiun')}
          >
            Stasiun
          </button>
          <button 
            className={`filter-bubble ${activeCategory === 'kantor' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('kantor')}
          >
            Kantor
          </button>
          <button 
            className={`filter-bubble ${activeCategory === 'gudang' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('gudang')}
          >
            Gudang
          </button>
          <button 
            className={`filter-bubble ${activeCategory === 'pjl' ? 'active' : ''}`}
            onClick={() => handleCategoryFilter('pjl')}
          >
            PJL
          </button>
        </div>

        {/* Mobile Floating Add Button */}
        <Button 
          variant="success"
          className="mobile-add-btn"
          onClick={() => setShowLocationModal(true)}
          title="Tambah Lokasi Baru"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />

        {/* Search Panel */}
        {searchOpen && (
          <>
            <div 
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(4px)',
                zIndex: 999,
                cursor: 'pointer'
              }}
              onClick={() => setSearchOpen(false)}
            />
            <div className="search-panel">
              <div className="search-panel-header">
                <input
                  type="text"
                  placeholder="Cari Lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                <button className="close-search" onClick={() => setSearchOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="search-results">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map(location => (
                    <div 
                      key={location.id} 
                      className="search-result-item"
                      onClick={() => handleLocationClick(location)}
                    >
                    <div className={`marker-indicator ${location.type}`}></div>
                      <div className="result-info">
                        <div className="result-name">
                          {location.name}
                          {location.code && <span style={{ marginLeft: '6px', fontWeight: '500', color: 'var(--primary)', fontSize: '12px' }}>({location.code})</span>}
                        </div>
                        <div className="result-category">{location.category}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">Tidak ada hasil ditemukan</div>
                )}
              </div>
            </div>
          </>
        )}

        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
          <MapController />
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredLocations.map(location => (
            <Marker 
              key={location.id} 
              position={location.position}
              icon={location.type === 'green' ? greenIcon : location.type === 'red' ? redIcon : location.type === 'yellow' ? yellowIcon : blueIcon}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current[location.id] = ref
                }
              }}
            >
              <Popup className="custom-popup">
                <div className="popup-content">
                  <div className="popup-title">
                    {location.name}
                    {location.code && <span style={{ marginLeft: '8px', fontWeight: '500', color: 'var(--primary)' }}>({location.code})</span>}
                  </div>
                  <div className="popup-stats">
                    <div className="stat-label">Total Perangkat:</div>
                    <div className="stat-value">{location.totalPerangkat}</div>
                  </div>
                  <Button 
                    variant="primary"
                    size="small"
                    fullWidth
                    onClick={() => navigate(`/location/${location.id}`)}
                  >
                    Lihat Selengkapnya...
                  </Button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>

{/* Modal Tambah Lokasi */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => {
          setShowLocationModal(false)
          if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview)
          }
          setFormData({
            name: '',
            latitude: '',
            longitude: '',
            category: 'stasiun',
            code: '',
            image: null,
            imagePreview: null
          })
        }}
        title="Tambah Lokasi Baru"
        size="medium"
        footer={
          <>
            <Button
              variant="danger"
              onClick={() => {
                setShowLocationModal(false)
                if (formData.imagePreview) {
                  URL.revokeObjectURL(formData.imagePreview)
                }
                setFormData({
                  name: '',
                  latitude: '',
                  longitude: '',
                  category: 'stasiun',
                  code: '',
                  image: null,
                  imagePreview: null
                })
              }}
            >
              Batal
            </Button>
            <Button
              variant="success"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
              onClick={handleAddLocation}
            >
              Tambah Lokasi
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Nama Tempat */}
          <Input
            label="Nama Tempat"
            placeholder="Contoh: Stasiun Baru"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
          />

          {/* Image Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Gambar Lokasi</label>
            {formData.imagePreview ? (
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
                <button
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ) : (
              <label 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '30px 20px',
                  border: '2px dashed var(--border-light)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: 'var(--bg-soft)',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--text-secondary)' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Klik untuk upload gambar</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG, JPEG (Max 5MB)</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Map Picker for Location Selection */}
          <MapPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            category={formData.category}
            onLocationChange={(lat, lng) => {
              setFormData(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
              }))
            }}
          />

          {/* Kategori */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Kategori</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                style={{ padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text-main)' }}
              >
                <option value="stasiun">Stasiun</option>
                <option value="kantor">Kantor</option>
                <option value="gudang">Gudang</option>
                <option value="pjl">PJL</option>
              </select>
            </div>

            {/* Kode Marker */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Kode Marker</label>
              <Input
                placeholder="STN"
                name="code"
                maxLength="6"
                value={formData.code || getCodeFromCategory(formData.category)}
                onChange={handleFormChange}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Success Loading Screen */}
      {showSuccessLoading && (
        <Loading 
          message="Berhasil menambah lokasi" 
          onComplete={() => setShowSuccessLoading(false)} 
        />
      )}

        </div>
      )}
    </>
  )
}

export default Home
