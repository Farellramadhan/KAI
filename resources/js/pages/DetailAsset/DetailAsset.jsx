import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Badge, Input, Modal } from '../../components'
import './DetailAsset.css'

function DetailInventaris() {
  const navigate = useNavigate()
  const { id, perangkatId } = useParams()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPerangkat, setFilterPerangkat] = useState('all')
  const [filterKondisi, setFilterKondisi] = useState('all')
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [actionMode, setActionMode] = useState(null) // null | 'edit' | 'delete'
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [allItems, setAllItems] = useState([])
  const [formData, setFormData] = useState({
    nama: '',
    jenis: '',
    hostname: '',
    merk: '',
    lokasi: '',
    ip: '',
          <div className="form-group">
            <label>Kondisi</label>
            <select
              value={formData.kondisi}
              onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
              className="form-select"
              style={{ 
                width: '100%', 
                padding: '10px 12px', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                marginTop: '4px'
              }}
            >
              <option value="Baik">Baik</option>
              <option value="Perlu Perbaikan">Perlu Perbaikan</option>
              <option value="Rusak">Rusak</option>
            </select>
          </div>
        { id: 8, nama: 'CCTV_08', hostname: 'cctv-08', merk: 'Hikvision DS-2', lokasi: 'Loket Tiket', ip: '10.1.1.18', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 9, nama: 'CCTV_09', hostname: 'cctv-09', merk: 'Hikvision DS-2', lokasi: 'Area Kantor', ip: '10.1.1.19', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 10, nama: 'CCTV_10', hostname: 'cctv-10', merk: 'Hikvision DS-2', lokasi: 'Koridor Utama', ip: '10.1.1.20', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 11, nama: 'CCTV_11', hostname: 'cctv-11', merk: 'Hikvision DS-2', lokasi: 'Tangga Darurat 1', ip: '10.1.1.21', status: 'tidak_aktif', kondisi: 'Perlu Perbaikan', jenis: 'CCTV IP Camera' },
        { id: 12, nama: 'CCTV_12', hostname: 'cctv-12', merk: 'Hikvision DS-2', lokasi: 'Tangga Darurat 2', ip: '10.1.1.22', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 13, nama: 'CCTV_13', hostname: 'cctv-13', merk: 'Hikvision DS-2', lokasi: 'Area Parkir', ip: '10.1.1.23', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 14, nama: 'CCTV_14', hostname: 'cctv-14', merk: 'Hikvision DS-2', lokasi: 'Pintu Keluar', ip: '10.1.1.24', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 15, nama: 'CCTV_15', hostname: 'cctv-15', merk: 'Hikvision DS-2', lokasi: 'Basement', ip: '10.1.1.25', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 16, nama: 'CCTV_16', hostname: 'cctv-16', merk: 'Hikvision DS-2', lokasi: 'Ruang Mesin', ip: '10.1.1.26', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 17, nama: 'CCTV_17', hostname: 'cctv-17', merk: 'Hikvision DS-2', lokasi: 'Area Outdoor 1', ip: '10.1.1.27', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 18, nama: 'CCTV_18', hostname: 'cctv-18', merk: 'Hikvision DS-2', lokasi: 'Area Outdoor 2', ip: '10.1.1.28', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' },
        { id: 19, nama: 'CCTV_19', hostname: 'cctv-19', merk: 'Hikvision DS-2', lokasi: 'Peron 4', ip: '10.1.1.29', status: 'tidak_aktif', kondisi: 'Perlu Perbaikan', jenis: 'CCTV IP Camera' },
        { id: 20, nama: 'CCTV_20', hostname: 'cctv-20', merk: 'Hikvision DS-2', lokasi: 'Peron 5', ip: '10.1.1.30', status: 'aktif', kondisi: 'Baik', jenis: 'CCTV IP Camera' }
      ]
    },

    // New entries for Kantor Daop 6
    '3-1': { // Kantor Daop 6 - CCTV IP Camera
      perangkatNama: 'CCTV IP Camera',
      lokasiNama: 'Kantor Daop 6 Yogyakarta',
      total: 8,
      aktif: 7,
      nonAktif: 1,
      items: [
        { id: 1, nama: 'CCTV_D6_01', lokasi: 'Lobby Utama', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 2, nama: 'CCTV_D6_02', lokasi: 'Ruang Rapat', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 3, nama: 'CCTV_D6_03', lokasi: 'Koridor Selatan', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 4, nama: 'CCTV_D6_04', lokasi: 'Koridor Utara', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 5, nama: 'CCTV_D6_05', lokasi: 'Pintu Masuk Belakang', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 6, nama: 'CCTV_D6_06', lokasi: 'Parkiran', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 7, nama: 'CCTV_D6_07', lokasi: 'Gudang', status: 'tidak_aktif', jenis: 'CCTV IP Camera' },
        { id: 8, nama: 'CCTV_D6_08', lokasi: 'Tangga Darurat', status: 'aktif', jenis: 'CCTV IP Camera' }
      ]
    },
    '3-2': { // Kantor Daop 6 - NVR Server
      perangkatNama: 'NVR Server',
      lokasiNama: 'Kantor Daop 6 Yogyakarta',
      total: 1,
      aktif: 1,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'NVR_D6_01', lokasi: 'Ruang Server', status: 'aktif', jenis: 'NVR Server' }
      ]
    },
    '3-3': { // Kantor Daop 6 - Core Switch
      perangkatNama: 'Core Switch',
      lokasiNama: 'Kantor Daop 6 Yogyakarta',
      total: 1,
      aktif: 1,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'CS_D6_01', lokasi: 'Ruang Server', status: 'aktif', jenis: 'Core Switch' }
      ]
    },
    '3': { // Kantor Daop 6 - Semua Perangkat
      perangkatNama: 'Semua Perangkat',
      lokasiNama: 'Kantor Daop 6 Yogyakarta',
      items: [] // Will be populated dynamically similar to existing pattern
    },

    // New entries for Gudang Logistik
    '4-1': { // Gudang Logistik - CCTV IP Camera
      perangkatNama: 'CCTV IP Camera',
      lokasiNama: 'Gudang Logistik  Yogyakarta',
      total: 5,
      aktif: 5,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'CCTV_GL_01', lokasi: 'Pintu Masuk Utama', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 2, nama: 'CCTV_GL_02', lokasi: 'Area Penataan Barang', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 3, nama: 'CCTV_GL_03', lokasi: 'Area Pengiriman', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 4, nama: 'CCTV_GL_04', lokasi: 'Parkiran', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 5, nama: 'CCTV_GL_05', lokasi: 'Gudang Penyimpanan', status: 'aktif', jenis: 'CCTV IP Camera' }
      ]
    },
    '4-2': { // Gudang Logistik - Access Point WiFi
      perangkatNama: 'Access Point WiFi',
      lokasiNama: 'Gudang Logistik  Yogyakarta',
      total: 2,
      aktif: 2,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'AP_GL_01', lokasi: 'Area Gudang', status: 'aktif', jenis: 'Access Point WiFi' },
        { id: 2, nama: 'AP_GL_02', lokasi: 'Ruang Kerja', status: 'aktif', jenis: 'Access Point WiFi' }
      ]
    },
    '4': { // Gudang Logistik - Semua Perangkat
      perangkatNama: 'Semua Perangkat',
      lokasiNama: 'Gudang Logistik  Yogyakarta',
      items: []
    },

    // New entries for PJL Lempuyangan
    '6-1': { // PJL Lempuyangan - CCTV IP Camera
      perangkatNama: 'CCTV IP Camera',
      lokasiNama: 'PJL Lempuyangan',
      total: 6,
      aktif: 6,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'CCTV_PJL_01', lokasi: 'Lobby Utama', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 2, nama: 'CCTV_PJL_02', lokasi: 'Area Parkir', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 3, nama: 'CCTV_PJL_03', lokasi: 'Koridor Utara', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 4, nama: 'CCTV_PJL_04', lokasi: 'Koridor Selatan', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 5, nama: 'CCTV_PJL_05', lokasi: 'Pintu Masuk', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 6, nama: 'CCTV_PJL_06', lokasi: 'Gudang', status: 'aktif', jenis: 'CCTV IP Camera' }
      ]
    },
    '6-2': { // PJL Lempuyangan - NVR Server
      perangkatNama: 'NVR Server',
      lokasiNama: 'PJL Lempuyangan',
      total: 1,
      aktif: 1,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'NVR_PJL_01', lokasi: 'Ruang Server', status: 'aktif', jenis: 'NVR Server' }
      ]
    },
    '6': { // PJL Lempuyangan - Semua Perangkat
      perangkatNama: 'Semua Perangkat',
      lokasiNama: 'PJL Lempuyangan',
      items: []
    },
    '1-2': { // Stasiun Lempuyangan - NVR Server
      perangkatNama: 'NVR Server',
      lokasiNama: 'Stasiun Lempuyangan',
      total: 2,
      aktif: 2,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'NVR_SL_01', lokasi: 'Ruang Server 1', status: 'aktif', jenis: 'NVR Server' },
        { id: 2, nama: 'NVR_SL_02', lokasi: 'Ruang Server 2', status: 'aktif', jenis: 'NVR Server' }
      ]
    },
    '1-3': { // Stasiun Lempuyangan - Core Switch
      perangkatNama: 'Core Switch',
      lokasiNama: 'Stasiun Lempuyangan',
      total: 1,
      aktif: 1,
      nonAktif: 0,
      items: [
        { id: 1, nama: 'CS_SL_01', lokasi: 'Ruang Server', status: 'aktif', jenis: 'Core Switch' }
      ]
    },
    '1-4': { // Stasiun Lempuyangan - Access Point WiFi
      perangkatNama: 'Access Point WiFi',
      lokasiNama: 'Stasiun Lempuyangan',
      total: 6,
      aktif: 5,
      nonAktif: 1,
      items: [
        { id: 1, nama: 'AP_WiFi_SL_01', lokasi: 'Lantai 1', status: 'aktif', jenis: 'Access Point WiFi' },
        { id: 2, nama: 'AP_WiFi_SL_02', lokasi: 'Lantai 2', status: 'aktif', jenis: 'Access Point WiFi' },
        { id: 3, nama: 'AP_WiFi_SL_03', lokasi: 'Peron', status: 'aktif', jenis: 'Access Point WiFi' },
        { id: 4, nama: 'AP_WiFi_SL_04', lokasi: 'Ruang Tunggu', status: 'aktif', jenis: 'Access Point WiFi' },
        { id: 5, nama: 'AP_WiFi_SL_05', lokasi: 'Area Kantor', status: 'aktif', jenis: 'Access Point WiFi' },
        { id: 6, nama: 'AP_WiFi_SL_06', lokasi: 'Outdoor', status: 'tidak_aktif', jenis: 'Access Point WiFi' }
      ]
    },
    '2-1': { // Stasiun Tugu - CCTV IP Camera
      perangkatNama: 'CCTV IP Camera',
      lokasiNama: 'Stasiun Tugu Yogyakarta',
      total: 26,
      aktif: 24,
      nonAktif: 2,
      items: [
        { id: 1, nama: 'CCTV_ST_01', lokasi: 'Pintu Masuk Utama', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 2, nama: 'CCTV_ST_02', lokasi: 'Pintu Masuk Samping', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 3, nama: 'CCTV_ST_03', lokasi: 'Hall Utama', status: 'tidak_aktif', jenis: 'CCTV IP Camera' },
        { id: 4, nama: 'CCTV_ST_04', lokasi: 'Peron 1', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 5, nama: 'CCTV_ST_05', lokasi: 'Peron 2', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 6, nama: 'CCTV_ST_06', lokasi: 'Peron 3', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 7, nama: 'CCTV_ST_07', lokasi: 'Peron 4', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 8, nama: 'CCTV_ST_08', lokasi: 'Ruang Tunggu A', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 9, nama: 'CCTV_ST_09', lokasi: 'Ruang Tunggu B', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 10, nama: 'CCTV_ST_10', lokasi: 'Loket Tiket 1', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 11, nama: 'CCTV_ST_11', lokasi: 'Loket Tiket 2', status: 'tidak_aktif', jenis: 'CCTV IP Camera' },
        { id: 12, nama: 'CCTV_ST_12', lokasi: 'Area Kantor', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 13, nama: 'CCTV_ST_13', lokasi: 'Koridor Utama', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 14, nama: 'CCTV_ST_14', lokasi: 'Tangga Darurat 1', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 15, nama: 'CCTV_ST_15', lokasi: 'Tangga Darurat 2', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 16, nama: 'CCTV_ST_16', lokasi: 'Area Lift', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 17, nama: 'CCTV_ST_17', lokasi: 'Area Parkir Level 1', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 18, nama: 'CCTV_ST_18', lokasi: 'Area Parkir Level 2', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 19, nama: 'CCTV_ST_19', lokasi: 'Pintu Keluar', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 20, nama: 'CCTV_ST_20', lokasi: 'Basement 1', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 21, nama: 'CCTV_ST_21', lokasi: 'Basement 2', status: 'tidak_aktif', jenis: 'CCTV IP Camera' },
        { id: 22, nama: 'CCTV_ST_22', lokasi: 'Ruang Mesin', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 23, nama: 'CCTV_ST_23', lokasi: 'Area Outdoor 1', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 24, nama: 'CCTV_ST_24', lokasi: 'Area Outdoor 2', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 25, nama: 'CCTV_ST_25', lokasi: 'Peron 5', status: 'aktif', jenis: 'CCTV IP Camera' },
        { id: 26, nama: 'CCTV_ST_26', lokasi: 'Peron 6', status: 'aktif', jenis: 'CCTV IP Camera' }
      ]
    },
    // Data untuk semua perangkat per lokasi (tanpa perangkatId)
    '1': { // Stasiun Lempuyangan - Semua Perangkat
      perangkatNama: 'Semua Perangkat',
      lokasiNama: 'Stasiun Lempuyangan',
      items: [] // Akan digabungkan dari semua perangkat
    },
    'default': {
      perangkatNama: 'Perangkat',
      lokasiNama: 'Lokasi',
      total: 0,
      aktif: 0,
      nonAktif: 0,
      items: []
    }
  }

  // Initialize data dan items
  useEffect(() => {
    let data;
    let items = [];

    if (perangkatId) {
      // Jika ada perangkatId, ambil data perangkat spesifik
      data = DetailData[`${id}-${perangkatId}`] || DetailData.default
      items = data.items || []
    } else {
      // Jika tidak ada perangkatId, gabungkan semua perangkat dari lokasi
      const lokasiNameMap = {
        '1': 'Stasiun Lempuyangan',
        '2': 'Stasiun Tugu Yogyakarta',
        '3': 'Kantor Daop 6 Yogyakarta',
        '4': 'Gudang Logistik Yogyakarta',
        '6': 'PJL Lempuyangan',
      }
      const lokasiName = lokasiNameMap[id] || 'Lokasi Tidak Dikenal'
      const allPerangkatKeys = Object.keys(DetailData).filter(key => key.startsWith(`${id}-`))
      
      // Gabungkan semua items dari semua perangkat
      items = allPerangkatKeys.flatMap(key => DetailData[key].items || [])
      
      data = {
        perangkatNama: 'Semua Perangkat',
        lokasiNama: lokasiName,
        items: items
      }
    }

    // Hitung total, aktif, nonAktif dari items
    // Normalize items to ensure fields: jenis, hostname, merk, ip, kondisi
    const merkPool = [
      'Hikvision DS-2',
      'Dahua X-Series',
      'Ubiquiti UniFi',
      'Cisco Catalyst',
      'MikroTik RouterBOARD',
      'Dell PowerEdge',
      'TP-Link Archer'
    ]

    const kondisiPool = ['Baik', 'Perlu Perbaikan', 'Rusak']

    const normalize = (it) => {
      const normalized = { ...it }
      normalized.jenis = normalized.jenis || normalized.nama || 'Perangkat'
      normalized.hostname = normalized.hostname || (
        (normalized.nama || '').toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')
      )
      normalized.merk = normalized.merk || merkPool[Math.abs((normalized.id || 0)) % merkPool.length]
      normalized.ip = normalized.ip || `10.${id || '0'}.${normalized.id || '0'}`
      normalized.kondisi = normalized.kondisi || kondisiPool[Math.abs((normalized.id || 0)) % kondisiPool.length]
      return normalized
    }

    items = items.map(normalize)

    const total = items.length
    const aktif = items.filter(item => item.status === 'aktif').length
    const nonAktif = total - aktif

    setCurrentData({
      ...data,
      total,
      aktif,
      nonAktif
    })
    setAllItems(items)
  }, [id, perangkatId])

  // Extract unique jenis perangkat untuk filter
  const uniquePerangkat = [...new Set(allItems.map(item => item.jenis))].filter(Boolean)

  // Filter items berdasarkan search, perangkat, dan status
  const filteredItems = allItems.filter(item => {
    const q = searchQuery.toLowerCase()
    const matchSearch = (item.nama || '').toString().toLowerCase().includes(q) ||
          (item.lokasi || '').toString().toLowerCase().includes(q) ||
          (item.hostname || '').toString().toLowerCase().includes(q) ||
          (item.merk || '').toString().toLowerCase().includes(q) ||
          (item.ip || '').toString().toLowerCase().includes(q)
    const matchPerangkat = filterPerangkat === 'all' || item.jenis === filterPerangkat
    const matchKondisi = filterKondisi === 'all' || item.kondisi === filterKondisi

    return matchSearch && matchPerangkat && matchKondisi
  })

  const handleAddItem = () => {
    setFormData({ nama: '', jenis: '', hostname: '', merk: '', lokasi: '', ip: '', kondisi: 'Baik' })
    setEditingItem(null)
    setShowAddModal(true)
  }

  const handleEditItem = (item) => {
    setFormData({ ...item })
    setEditingItem(item.id)
    setShowEditModal(true)
  }

  const handleSaveItem = () => {
    if (!formData.jenis || !formData.hostname || !formData.lokasi) {
      alert('Field Jenis, Hostname, dan Lokasi harus diisi!')
      return
    }

    if (editingItem) {
      setAllItems(allItems.map(item => 
        item.id === editingItem ? { ...formData, id: editingItem } : item
      ))
      console.log('Update item:', formData)
    } else {
      const newItem = {
        id: Math.max(...allItems.map(i => i.id), 0) + 1,
        ...formData
      }
      setAllItems([...allItems, newItem])
      console.log('Add item:', newItem)
    }

    setShowAddModal(false)
    setShowEditModal(false)
    setFormData({ nama: '', jenis: '', hostname: '', merk: '', lokasi: '', ip: '', kondisi: 'Baik' })
  }

  const handleDeleteItem = (itemId) => {
    const item = allItems.find(i => i.id === itemId)
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      setAllItems(allItems.filter(item => item.id !== itemToDelete.id))
      console.log('Delete item:', itemToDelete.id)
      setShowDeleteModal(false)
      setItemToDelete(null)
      setActiveMenuId(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
  }

  if (!currentData) {
    return (
      <div className="detail-Detail-container">
        <div className="Detail-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span>&lt;</span>
          </button>
          <h1 className="Detail-title">Memuat data...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-Detail-container">
      {/* Header */}
      <div className="Detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="header-info">
          <h1 className="Detail-title">{currentData.perangkatNama}</h1>
          <p className="Detail-subtitle">{currentData.lokasiNama}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="Detail-content">
        {/* Stats Section */}
        <div className="Detail-stats-section">
          <div className="Detail-stat-card">
            <div className="Detail-stat-icon total">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <div className="Detail-stat-info">
              <p className="Detail-stat-label">Total</p>
              <p className="Detail-stat-value">{currentData.total}</p>
            </div>
          </div>

          <div className="Detail-stat-card">
            <div className="Detail-stat-icon aktif">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="Detail-stat-info">
              <p className="Detail-stat-label">SO (Siap Operasi))</p>
              <p className="Detail-stat-value">{currentData.aktif}</p>
            </div>
          </div>

          <div className="Detail-stat-card">
            <div className="Detail-stat-icon nonaktif">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="Detail-stat-info">
              <p className="Detail-stat-label">TSO (Tidak Siap Operasi)</p>
              <p className="Detail-stat-value">{currentData.nonAktif}</p>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="Detail-list-section">
          <div className="list-header">
            <h2 className="list-title">Daftar Item</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button 
                variant="success" 
                size="medium"
                onClick={handleAddItem}
                icon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                }
              >
                Tambah
              </Button>

              <div className="actions-dropdown-wrapper" style={{ position: 'relative' }}>
                <button className="actions-dropdown-btn" onClick={() => setShowActionsMenu(!showActionsMenu)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-light)', background: 'white' }}>
                  ⋯
                </button>
                {showActionsMenu && (
                  <div className="actions-dropdown" style={{ position: 'absolute', right: 0, marginTop: 6, background: 'white', border: '1px solid var(--border-light)', borderRadius: 8, padding: 8, zIndex: 40 }}>
                    <button className="dropdown-action" onClick={() => { setActionMode(null); setShowActionsMenu(false); }}>Tambah (default)</button>
                    <button className="dropdown-action" onClick={() => { setActionMode('edit'); setShowActionsMenu(false); }}>Mode Edit (klik baris)</button>
                    <button className="dropdown-action" onClick={() => { setActionMode('delete'); setShowActionsMenu(false); }}>Mode Hapus (klik baris)</button>
                    <button className="dropdown-action" onClick={() => { setActionMode(null); setShowActionsMenu(false); }}>Batal Mode</button>
                  </div>
                )}
              </div>
              {actionMode && (
                <div style={{ marginLeft: 8, padding: '6px 10px', borderRadius: 8, background: 'var(--gray-50)', border: '1px solid var(--border-light)', fontSize: 13 }}>
                  Mode: {actionMode === 'edit' ? 'Edit' : actionMode === 'delete' ? 'Hapus' : 'Normal'}
                </div>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <Input
                type="text"
                label="Cari"
                placeholder="Cari nama atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />
            </div>
            
            {!perangkatId && uniquePerangkat.length > 0 && (
              <div className="filter-group">
                <label className="filter-label">Jenis Perangkat</label>
                <select
                  value={filterPerangkat}
                  onChange={(e) => setFilterPerangkat(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Semua Perangkat</option>
                  {uniquePerangkat.map(jenis => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="filter-group">
              <label className="filter-label">Kondisi</label>
              <select
                value={filterKondisi}
                onChange={(e) => setFilterKondisi(e.target.value)}
                className="filter-select"
              >
                <option value="all">Semua Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Perlu Perbaikan">Perlu Perbaikan</option>
                <option value="Rusak">Rusak</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="table-wrapper">
            <table className="Detail-table">
              <thead>
                <tr>
                  <th>Jenis Perangkat</th>
                  <th>Hostname</th>
                  <th>Merk / Spek</th>
                  <th>Lokasi</th>
                  <th>IP Perangkat</th>
                  <th>Kondisi</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map(item => (
                    <tr key={item.id} onClick={() => {
                        if (actionMode === 'edit') { handleEditItem(item); setActionMode(null) }
                        else if (actionMode === 'delete') { handleDeleteItem(item.id); setActionMode(null) }
                      }} style={{ cursor: actionMode ? 'pointer' : 'default' }}>
                        <td className="jenis-cell">{item.jenis || '-'}</td>
                        <td className="hostname-cell">{item.hostname || item.nama || '-'}</td>
                        <td className="merk-cell">{item.merk || '-'}</td>
                        <td className="lokasi-cell">{item.lokasi}</td>
                        <td className="ip-cell">{item.ip || '-'}</td>
                        <td className="kondisi-cell">{item.kondisi || '-'}</td>
                      </tr>
                  ))
                ) : (
                    <tr>
                      <td colSpan="6" className="empty-state">Tidak ada data</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
        }}
        title={editingItem ? 'Edit Item' : 'Tambah Item'}
        size="medium"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAddModal(false)
                setShowEditModal(false)
              }}
            >
              Batal
            </Button>
            <Button
              variant="success"
              onClick={handleSaveItem}
            >
              Simpan
            </Button>
          </>
        }
      >
          <div className="modal-body">
          <Input
            label="Jenis Perangkat"
            placeholder="Masukkan jenis perangkat"
            value={formData.jenis}
            onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
          />

          <Input
            label="Hostname"
            placeholder="Masukkan hostname"
            value={formData.hostname}
            onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
          />

          <Input
            label="Merk / Spek"
            placeholder="Masukkan merk atau spesifikasi"
            value={formData.merk}
            onChange={(e) => setFormData({ ...formData, merk: e.target.value })}
          />

          <Input
            label="Lokasi"
            placeholder="Masukkan lokasi"
            value={formData.lokasi}
            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
          />

          <Input
            label="IP Perangkat"
            placeholder="Masukkan IP perangkat"
            value={formData.ip}
            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
          />

          <Input
            label="Kondisi"
            placeholder="Masukkan kondisi (mis. Baik, Rusak...)"
            value={formData.kondisi}
            onChange={(e) => setFormData({ ...formData, kondisi: e.target.value })}
          />

          {/* Kondisi is already an input above; we kept it as free text but could switch to select if needed. */}
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Konfirmasi Hapus"
        size="small"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={cancelDelete}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            >
              Hapus
            </Button>
          </>
        }
      >
        {itemToDelete && (
          <div style={{ padding: '10px 0' }}>
            <p style={{ marginBottom: '15px', color: 'var(--text-main)' }}>
              Apakah Anda yakin ingin menghapus item ini?
            </p>
            <div style={{ 
              background: 'var(--gray-50)', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid var(--border-light)'
            }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: 'var(--text-main)' }}>
                {itemToDelete.nama}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                Lokasi: {itemToDelete.lokasi}
              </p>
            </div>
            <p style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DetailInventaris
