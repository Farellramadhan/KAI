import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Badge, Modal } from '../../components'
import { locationsAPI, devicesAPI } from '../../api'
import './LocationDetail.css'

function DetailAset() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [selectedPerangkat, setSelectedPerangkat] = useState(null)
  const [showPerangkatPopup, setShowPerangkatPopup] = useState(false)
  const [location, setLocation] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        console.error('Error fetching data:', err)
        setError('Gagal memuat data. Silakan coba lagi.')
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
    if (showPerangkatPopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showPerangkatPopup])

  const handlePerangkatClick = (perangkat) => {
    setSelectedPerangkat(perangkat)
    setShowPerangkatPopup(true)
  }

  // Calculate stats
  const totalPerangkat = devices.reduce((sum, d) => sum + d.aktif + d.tidakAktif, 0)
  const aktifCount = devices.reduce((sum, d) => sum + d.aktif, 0)
  const nonAktifCount = devices.reduce((sum, d) => sum + d.tidakAktif, 0)

  if (loading) {
    return (
      <div className="detail-aset-container">
        <div className="loading-state">
          <p>Memuat data...</p>
        </div>
      </div>
    )
  }

  if (error || !location) {
    return (
      <div className="detail-aset-container">
        <div className="error-state">
          <p>{error || 'Lokasi tidak ditemukan'}</p>
          <button onClick={() => navigate('/home')}>Kembali ke Home</button>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-aset-container">
      {/* Header */}
      <div className="detail-aset-header">
        <button className="back-button" onClick={() => navigate('/home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1>{location.name} {location.code && `(${location.code})`}</h1>
        <div className="legend" style={{marginTop: '6px'}}>
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
    </div>
  )
}

export default DetailAset
