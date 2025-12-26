import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Badge, Modal, Input, Loading, MapPicker } from '../../components'
import { useToast } from '../../components/Toast'
import { locationsAPI, devicesAPI } from '../../api'
import './LocationDetail.css'

function DetailAset() {
  const navigate = useNavigate()
  const { id } = useParams()
  const toast = useToast()
  const [selectedPerangkat, setSelectedPerangkat] = useState(null)
  const [showPerangkatPopup, setShowPerangkatPopup] = useState(false)
  const [location, setLocation] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Edit & Delete states
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDropdownMenu, setShowDropdownMenu] = useState(false)
  const dropdownRef = useRef(null)
  const [editFormData, setEditFormData] = useState({
    name: '',
    latitude: '',
    longitude: '',
    category: 'stasiun',
    code: '',
    image: null,
    imagePreview: null
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Fetch location and devices data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch location details
        const locationData = await locationsAPI.getById(id)
        setLocation(locationData)
        
        // Fetch devices for this location
        const devicesData = await devicesAPI.getByLocation(id)
        
        // Group devices by type and calculate counts
        const groupedDevices = devicesData.reduce((acc, device) => {
          const type = device.type || device.name
          if (!acc[type]) {
            acc[type] = {
              id: type,
              nama: type,
              aktif: 0,
              tidakAktif: 0,
              status: 'aktif'
            }
          }
          
          if (device.status === 'active' || device.status === 'aktif') {
            acc[type].aktif += 1
          } else {
            acc[type].tidakAktif += 1
          }
          
          // Set overall status to tidak_aktif if any device is inactive
          if (device.status !== 'active' && device.status !== 'aktif') {
            acc[type].status = 'tidak_aktif'
          }
          
          return acc
        }, {})
        
        setDevices(Object.values(groupedDevices))
        setError(null)
      } catch (err) {
        setError('Gagal Memuat Data. Silakan Coba Lagi.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // Control body overflow ketika popup muncul
  useEffect(() => {
    if (showPerangkatPopup || showEditModal || showDeleteModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showPerangkatPopup, showEditModal, showDeleteModal])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Open edit modal with current location data
  const openEditModal = () => {
    setEditFormData({
      name: location.name || '',
      latitude: location.latitude?.toString() || '',
      longitude: location.longitude?.toString() || '',
      category: location.category || 'stasiun',
      code: location.code || '',
      image: null,
      imagePreview: location.image_url || null
    })
    setShowEditModal(true)
  }

  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle image change for edit
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.warning('Silakan pilih file gambar!')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.warning('Ukuran gambar maksimal 5MB!')
        return
      }
      setEditFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  // Remove image
  const removeImage = () => {
    if (editFormData.imagePreview && editFormData.image) {
      URL.revokeObjectURL(editFormData.imagePreview)
    }
    setEditFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }))
  }

  // Handle update location
  const handleUpdateLocation = async () => {
    if (!editFormData.name || !editFormData.latitude || !editFormData.longitude) {
      toast.warning('Silakan isi semua field yang wajib!')
      return
    }

    setIsUpdating(true)
    try {
      const formData = new FormData()
      formData.append('name', editFormData.name)
      formData.append('latitude', parseFloat(editFormData.latitude))
      formData.append('longitude', parseFloat(editFormData.longitude))
      formData.append('category', editFormData.category)
      formData.append('code', editFormData.code)
      
      if (editFormData.image) {
        formData.append('image', editFormData.image)
      }

      const updatedLocation = await locationsAPI.update(id, formData)
      setLocation(updatedLocation)
      setShowEditModal(false)
      toast.success('Lokasi berhasil diperbarui!')
    } catch (err) {
      toast.error('Gagal memperbarui lokasi: ' + err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  // Handle delete location
  const handleDeleteLocation = async () => {
    setIsDeleting(true)
    try {
      await locationsAPI.delete(id)
      // Keep loading screen for a moment to show success
      setTimeout(() => {
        navigate('/home')
      }, 500)
    } catch (err) {
      setIsDeleting(false)
      toast.error('Gagal menghapus lokasi: ' + err.message)
    }
  }

  const handlePerangkatClick = (perangkat) => {
    setSelectedPerangkat(perangkat)
    setShowPerangkatPopup(true)
  }

  // Calculate stats
  const totalPerangkat = devices.reduce((sum, d) => sum + d.aktif + d.tidakAktif, 0)
  const aktifCount = devices.reduce((sum, d) => sum + d.aktif, 0)
  const nonAktifCount = devices.reduce((sum, d) => sum + d.tidakAktif, 0)

  if (loading) {
    return <Loading message="Memuat Detail Lokasi..." />
  }

  if (isDeleting) {
    return <Loading message="Menghapus lokasi..." />
  }

  if (error || !location) {
    return (
      <div className="detail-aset-container">
        <Card variant="outlined" className="error-state-card">
          <div className="error-state">
            <Badge variant="danger" size="large">Error</Badge>
            <p>{error || 'Lokasi tidak ditemukan'}</p>
            <Button variant="primary" onClick={() => navigate('/home')}>Kembali ke Home</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="detail-aset-container">
      {/* Header */}
      <div className="detail-aset-header">
        <Button 
          variant="ghost" 
          className="back-button" 
          onClick={() => navigate('/home')}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
        <h1>{location.name} {location.code && `(${location.code})`}</h1>
        <div className="header-actions" ref={dropdownRef}>
          <Button 
            variant="ghost" 
            className="more-btn" 
            onClick={() => setShowDropdownMenu(!showDropdownMenu)}
            title="Menu"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="5" r="2" fill="currentColor"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="12" cy="19" r="2" fill="currentColor"/>
              </svg>
            }
          />
          
          {showDropdownMenu && (
            <div className="dropdown-menu-actions">
              <Button 
                variant="ghost" 
                className="dropdown-item edit" 
                onClick={() => {
                  setShowDropdownMenu(false)
                  openEditModal()
                }}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                Edit Lokasi
              </Button>
              <Button 
                variant="ghost" 
                className="dropdown-item delete" 
                onClick={() => {
                  setShowDropdownMenu(false)
                  setShowDeleteModal(true)
                }}
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                Hapus Lokasi
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-aset-content">
        {/* Image and Stats Section */}
        <div className="image-stats-section">
          <div className="image-container">
            <img 
              src={location.image_url || 'https://images.unsplash.com/photo-1561361513-e8d53f0e6f67?w=500&h=300&fit=crop'} 
              alt={location.name} 
            />
            <div className="image-overlay">
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-card total">
              <div className="stat-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 9h6M9 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">Total Perangkat</div>
                <div className="stat-value">{totalPerangkat}</div>
              </div>
            </div>

            <div className="stat-card aktif">
              <div className="stat-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">SO (Siap Operasi)</div>
                <div className="stat-value">{aktifCount}</div>
              </div>
            </div>

            <div className="stat-card non-aktif">
              <div className="stat-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="stat-info">
                <div className="stat-label">TSO (Tidak Siap Operasi)</div>
                <div className="stat-value">{nonAktifCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Perangkat Section */}
        <div className="daftar-perangkat-section">
          <div className="section-header">
            <h2>Daftar Perangkat</h2>
            <Button 
              variant="primary"
              size="medium"
              onClick={() => navigate(`/location/${id}/inventory`)}
            >
              Lihat Detail
            </Button>
          </div>

          <div className="perangkat-grid">
            {devices.map(item => (
              <div 
                key={item.id} 
                className="perangkat-card"
                onClick={() => handlePerangkatClick(item)}
              >
                <div className="perangkat-info">
                  <div className="perangkat-details">
                    <p className="perangkat-name">{item.nama}</p>
                    <p className="perangkat-jumlah">{item.aktif + item.tidakAktif} unit</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Perangkat Detail Modal */}
      <Modal
        isOpen={showPerangkatPopup}
        onClose={() => setShowPerangkatPopup(false)}
        title={selectedPerangkat?.nama}
        size="medium"
      >
        {selectedPerangkat && (
          <div className="popup-body">
            <div className="popup-detail-item">
              <div className="detail-label">Total Unit</div>
              <div className="detail-value">{selectedPerangkat.aktif + selectedPerangkat.tidakAktif}</div>
            </div>

            <div className="popup-detail-grid">
            <div className="popup-detail-item">
              <div className="detail-label" title="SO: Siap Operasi">SO</div>
              <Badge variant="success" size="large">{selectedPerangkat.aktif}</Badge>
            </div>
            <div className="popup-detail-item">
              <div className="detail-label" title="TSO: Tidak Siap Operasi">TSO</div>
              <Badge variant="danger" size="large">{selectedPerangkat.tidakAktif}</Badge>
            </div>
            </div>

            <div className="popup-detail-item">
              <div className="detail-label">Persentase SO</div>
              <div className="progress-bar" style={{
                width: '100%',
                height: '12px',
                backgroundColor: 'var(--gray-200)',
                borderRadius: '6px',
                overflow: 'hidden',
                marginTop: '8px'
              }}>
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${((selectedPerangkat.aktif / (selectedPerangkat.aktif + selectedPerangkat.tidakAktif)) * 100)}%`,
                    height: '100%',
                    backgroundColor: 'var(--success)',
                    transition: 'width 0.3s ease',
                    borderRadius: '6px'
                  }}
                ></div>
              </div>
              <div className="progress-text" style={{
                marginTop: '8px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-secondary)'
              }}>
                {Math.round((selectedPerangkat.aktif / (selectedPerangkat.aktif + selectedPerangkat.tidakAktif)) * 100)}% SO
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          if (editFormData.image) {
            URL.revokeObjectURL(editFormData.imagePreview)
          }
        }}
        title="Edit Lokasi"
        size="medium"
        footer={
          <>
            <Button variant="danger" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button variant="success" onClick={handleUpdateLocation} disabled={isUpdating}>
              {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Input
            label="Nama Tempat"
            placeholder="Nama Lokasi"
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
          />

          {/* Image Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Gambar Lokasi</label>
            {editFormData.imagePreview ? (
              <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <img 
                  src={editFormData.imagePreview} 
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
                  background: 'var(--bg-soft)'
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--text-secondary)' }}>
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                  <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Klik untuk upload gambar</span>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Map Picker */}
          <MapPicker
            latitude={editFormData.latitude}
            longitude={editFormData.longitude}
            category={editFormData.category}
            onLocationChange={(lat, lng) => {
              setEditFormData(prev => ({
                ...prev,
                latitude: lat,
                longitude: lng
              }))
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Kategori</label>
              <select
                name="category"
                value={editFormData.category}
                onChange={handleEditFormChange}
                style={{ padding: '10px 12px', border: '1px solid var(--border-light)', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', background: 'var(--bg)', color: 'var(--text-main)' }}
              >
                <option value="stasiun">Stasiun</option>
                <option value="kantor">Kantor</option>
                <option value="gudang">Gudang</option>
                <option value="pjl">PJL</option>
              </select>
            </div>
            <Input
              label="Kode Marker"
              placeholder="STN"
              name="code"
              maxLength="6"
              value={editFormData.code}
              onChange={handleEditFormChange}
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Hapus Lokasi"
        size="small"
        footer={
          <>
            <Button variant="danger" onClick={() => setShowDeleteModal(false)}>
              Batal
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteLocation} 
              disabled={isDeleting}
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'center' }}>
          <div style={{ fontSize: '60px' }}>⚠️</div>
          <p style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)' }}>
            Apakah Anda yakin ingin menghapus lokasi ini?
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            <strong>"{location.name}"</strong> dan semua data perangkat di dalamnya akan dihapus secara permanen.
          </p>
        </div>
      </Modal>
    </div>
  )
}

export default DetailAset
