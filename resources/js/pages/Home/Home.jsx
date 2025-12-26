import React, { useState, useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Input } from '../../components'
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

function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [showMobileList, setShowMobileList] = useState(false)
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    category: 'stasiun',
    code: ''
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
        console.error('Error fetching locations:', err)
        setError('Gagal memuat data lokasi. Silakan refresh halaman.')
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
      gudang: 'red',
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
  }

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
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
      alert('Silakan isi semua field yang wajib!')
      return
    }

    try {
      const locationData = {
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        category: formData.category,
        code: formData.code || getCodeFromCategory(formData.category),
        description: 'Lokasi baru'
      }

      const newLocation = await locationsAPI.create(locationData)
      
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
        code: ''
      })
      setShowAddLocationModal(false)
      alert('Lokasi berhasil ditambahkan!')
    } catch (err) {
      console.error('Error adding location:', err)
      alert('Gagal menambahkan lokasi: ' + err.message)
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

  const MapController = () => {
    const map = useMap()
    mapRef.current = map
    return null
  }

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="welcome-text">Selamat Datang {welcomeName}!</h1>
        </div>
        <div className="header-right">
          <button className="user-button" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="dropdown-menu">
              <div className="profile-info">
                <div className="profile-avatar">
                  <img width="32" height="32" src="/image/avatar.jpg" alt="User Avatar" />
                </div>
                <div className="profile-details">
                  <p className="profile-name">{welcomeName}</p>
                  <p className="profile-email">{user?.email || 'user@kai.id'}</p>
                </div>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-container">
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
            placeholder="Cari lokasi..."
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
              <div className="profile-info">
                <div className="profile-avatar">
                  <img width="48" height="48" src="/image/avatar.jpg" alt="User Avatar" />
                </div>
                <div className="profile-details">
                  <p className="profile-name">{welcomeName}</p>
                  <p className="profile-email">{user?.email || 'user@kai.id'}</p>
                </div>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
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
                  placeholder="Cari lokasi..."
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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredLocations.map(location => (
            <Marker 
              key={location.id} 
              position={location.position}
              icon={location.type === 'green' ? greenIcon : location.type === 'red' ? redIcon : blueIcon}
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

        {/* Add Location Button */}
        <button 
          className="add-location-btn"
          onClick={() => setShowAddLocationModal(true)}
          title="Tambah Lokasi"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="map-bottom-controls">
          <div className="zoom-controls">
            <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In">+</button>
            <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out">−</button>
          </div>
        </div>
      </main>

      {/* Modal Tambah Lokasi */}
      <Modal
        isOpen={showAddLocationModal}
        onClose={() => setShowAddLocationModal(false)}
        title="Tambah Lokasi Baru"
        size="medium"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setShowAddLocationModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="success"
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

          {/* Koordinat */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Latitude"
              placeholder="-7.795"
              name="latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={handleFormChange}
            />
            <Input
              label="Longitude"
              placeholder="110.369"
              name="longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={handleFormChange}
            />
          </div>

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
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Kode Marker (Bisa Diedit)</label>
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
    </div>
  )
}

export default Home

