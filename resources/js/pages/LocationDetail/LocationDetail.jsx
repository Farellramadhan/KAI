import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, Badge, Modal } from '../../components'
import './LocationDetail.css'

function DetailAset() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [selectedPerangkat, setSelectedPerangkat] = useState(null)
  const [showPerangkatPopup, setShowPerangkatPopup] = useState(false)

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

  // Data lokasi berdasarkan ID
  const locationData = {
    1: {
      name: 'Stasiun Lempuyangan (LPN)',
      image: 'https://images.unsplash.com/photo-1561361513-e8d53f0e6f67?w=500&h=300&fit=crop',
      totalPerangkat: 200,
      aktif: 170,
      nonAktif: 30,
      perangkat: [
        { id: 1, nama: 'CCTV IP Camera', aktif: 18, tidakAktif: 2, status: 'aktif' },
        { id: 2, nama: 'NVR Server', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 3, nama: 'Core Switch', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 4, nama: 'Access Point WiFi', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 5, nama: 'Firewall UTM', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 6, nama: 'Server Lokal', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 7, nama: 'PIDS Monitor', aktif: 8, tidakAktif: 1, status: 'aktif' },
        { id: 8, nama: 'KP2T Vending Machine', aktif: 3, tidakAktif: 0, status: 'aktif' },
        { id: 9, nama: 'PC Ticketing', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 10, nama: 'IP Phone VoIP', aktif: 12, tidakAktif: 2, status: 'aktif' },
        { id: 11, nama: 'Laptop Operasional', aktif: 8, tidakAktif: 2, status: 'aktif' },
        { id: 12, nama: 'Printer & Scanner', aktif: 6, tidakAktif: 1, status: 'aktif' },
        { id: 13, nama: 'HT Digital', aktif: 10, tidakAktif: 3, status: 'aktif' },
        { id: 14, nama: 'UPS System', aktif: 4, tidakAktif: 1, status: 'aktif' },
        { id: 15, nama: 'Router / Gateway', aktif: 2, tidakAktif: 2, status: 'tidak_aktif' }
      ]
    },
    2: {
      name: 'Stasiun Tugu Yogyakarta (YK)',
      image: 'https://assets.telkomsel.com/public/2025-02/Mengenal-6-Stasiun-Yogyakarta-yang-Bersejarah.jpg?VersionId=TS3XgYVifrRd.Oz_N7tGYe6YYKEf_ngJ',
      totalPerangkat: 250,
      aktif: 210,
      nonAktif: 40,
      perangkat: [
        { id: 1, nama: 'CCTV IP Camera', aktif: 24, tidakAktif: 2, status: 'aktif' },
        { id: 2, nama: 'NVR Server', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 3, nama: 'Core Switch', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 4, nama: 'Access Point WiFi', aktif: 8, tidakAktif: 1, status: 'aktif' },
        { id: 5, nama: 'Firewall UTM', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 6, nama: 'Server Lokal', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 7, nama: 'PIDS Monitor', aktif: 10, tidakAktif: 1, status: 'aktif' },
        { id: 8, nama: 'KP2T Vending Machine', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 9, nama: 'PC Ticketing', aktif: 8, tidakAktif: 1, status: 'aktif' },
        { id: 10, nama: 'IP Phone VoIP', aktif: 16, tidakAktif: 2, status: 'aktif' },
        { id: 11, nama: 'Laptop Operasional', aktif: 11, tidakAktif: 3, status: 'aktif' },
        { id: 12, nama: 'Printer & Scanner', aktif: 8, tidakAktif: 2, status: 'aktif' },
        { id: 13, nama: 'HT Digital', aktif: 14, tidakAktif: 4, status: 'aktif' },
        { id: 14, nama: 'UPS System', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 15, nama: 'Modem LTE Backup', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 16, nama: 'Router / Gateway', aktif: 3, tidakAktif: 4, status: 'tidak_aktif' }
      ]
    },
    3: {
      name: 'Kantor Daop 6 Yogyakarta',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=300&fit=crop',
      totalPerangkat: 120,
      aktif: 100,
      nonAktif: 20,
      perangkat: [
        { id: 1, nama: 'Server Central', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 2, nama: 'Server Virtualisasi', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 3, nama: 'Storage NAS', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 4, nama: 'Firewall UTM', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 5, nama: 'Core Switch L3', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 6, nama: 'UPS Besar', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 7, nama: 'CCTV Monitoring', aktif: 8, tidakAktif: 1, status: 'aktif' },
        { id: 8, nama: 'NVR Monitoring', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 9, nama: 'PC Staf', aktif: 18, tidakAktif: 2, status: 'aktif' },
        { id: 10, nama: 'Laptop Manajemen', aktif: 8, tidakAktif: 1, status: 'aktif' },
        { id: 11, nama: 'Printer & Scanner', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 12, nama: 'IP Phone PBX', aktif: 10, tidakAktif: 1, status: 'aktif' },
        { id: 13, nama: 'Digital Signage', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 14, nama: 'Access Control', aktif: 4, tidakAktif: 1, status: 'aktif' },
        { id: 15, nama: 'Server Monitoring', aktif: 1, tidakAktif: 1, status: 'tidak_aktif' }
      ]
    },
    4: {
      name: 'Gudang Logistik Yogyakarta',
      image: 'https://images.unsplash.com/photo-1553531088-2f6b1d69f962?w=500&h=300&fit=crop',
      totalPerangkat: 85,
      aktif: 70,
      nonAktif: 15,
      perangkat: [
        { id: 1, nama: 'CCTV Indoor / Outdoor', aktif: 12, tidakAktif: 1, status: 'aktif' },
        { id: 2, nama: 'NVR System', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 3, nama: 'Barcode Scanner', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 4, nama: 'Thermal Label Printer', aktif: 3, tidakAktif: 0, status: 'aktif' },
        { id: 5, nama: 'PC Operasional', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 6, nama: 'Switch Jaringan', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 7, nama: 'Access Point WiFi', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 8, nama: 'Router', aktif: 1, tidakAktif: 1, status: 'tidak_aktif' },
        { id: 9, nama: 'Handheld Tablet', aktif: 4, tidakAktif: 0, status: 'aktif' },
        { id: 10, nama: 'Timbangan Digital', aktif: 3, tidakAktif: 1, status: 'aktif' },
        { id: 11, nama: 'Door Access Control', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 12, nama: 'UPS System', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 13, nama: 'Printer Dokumen', aktif: 2, tidakAktif: 1, status: 'tidak_aktif' }
      ]
    },
    5: {
      name: 'Stasiun Maguwo (MGW)',
      image: 'https://images.unsplash.com/photo-1561361513-e8d53f0e6f67?w=500&h=300&fit=crop',
      totalPerangkat: 95,
      aktif: 80,
      nonAktif: 15,
      perangkat: [
        { id: 1, nama: 'CCTV IP Camera', aktif: 12, tidakAktif: 1, status: 'aktif' },
        { id: 2, nama: 'NVR Server', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 3, nama: 'Core Switch', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 4, nama: 'Access Point WiFi', aktif: 3, tidakAktif: 0, status: 'aktif' },
        { id: 5, nama: 'Firewall UTM', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 6, nama: 'PIDS Monitor', aktif: 5, tidakAktif: 1, status: 'aktif' },
        { id: 7, nama: 'PC Ticketing', aktif: 4, tidakAktif: 0, status: 'aktif' },
        { id: 8, nama: 'IP Phone VoIP', aktif: 7, tidakAktif: 1, status: 'aktif' },
        { id: 9, nama: 'Laptop Operasional', aktif: 6, tidakAktif: 1, status: 'aktif' },
        { id: 10, nama: 'Printer & Scanner', aktif: 4, tidakAktif: 1, status: 'aktif' },
        { id: 11, nama: 'HT Digital', aktif: 9, tidakAktif: 2, status: 'aktif' },
        { id: 12, nama: 'UPS System', aktif: 3, tidakAktif: 1, status: 'aktif' },
        { id: 13, nama: 'Router / Gateway', aktif: 2, tidakAktif: 2, status: 'tidak_aktif' }
      ]
    },
    6: {
      name: 'PJL Lempuyangan',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&h=300&fit=crop',
      totalPerangkat: 60,
      aktif: 50,
      nonAktif: 10,
      perangkat: [
        { id: 1, nama: 'CCTV Perlintasan', aktif: 6, tidakAktif: 1, status: 'aktif' },
        { id: 2, nama: 'CCTV PTZ', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 3, nama: 'Radio Komunikasi HT', aktif: 8, tidakAktif: 2, status: 'aktif' },
        { id: 4, nama: 'IP Phone', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 5, nama: 'Controller Box PLC', aktif: 1, tidakAktif: 0, status: 'aktif' },
        { id: 6, nama: 'Modem/ONT Fiber', aktif: 1, tidakAktif: 1, status: 'tidak_aktif' },
        { id: 7, nama: 'Mini UPS Palang', aktif: 3, tidakAktif: 0, status: 'aktif' },
        { id: 8, nama: 'Lampu & Sensor', aktif: 8, tidakAktif: 1, status: 'aktif' },
        { id: 9, nama: 'Panel Kontrol', aktif: 2, tidakAktif: 0, status: 'aktif' },
        { id: 10, nama: 'Smart Controller', aktif: 2, tidakAktif: 1, status: 'tidak_aktif' }
      ]
    }
  }

  const data = locationData[id] || locationData[1]

  const handlePerangkatClick = (perangkat) => {
    setSelectedPerangkat(perangkat)
    setShowPerangkatPopup(true)
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
        <h1>{data.name}</h1>
        <div className="legend" style={{marginTop: '6px'}}>
        </div>
      </div>

      {/* Main Content */}
      <div className="detail-aset-content">
        {/* Image and Stats Section */}
        <div className="image-stats-section">
          <div className="image-container">
            <img src={data.image} alt={data.name} />
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
                <div className="stat-value">{data.totalPerangkat}</div>
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
                <div className="stat-value">{data.aktif}</div>
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
                <div className="stat-value">{data.nonAktif}</div>
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
            {data.perangkat.map(item => (
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
