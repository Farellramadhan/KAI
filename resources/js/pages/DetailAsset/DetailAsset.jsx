import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Badge, Input, Modal, Loading, Card } from '../../components'
import { useToast } from '../../components/Toast'
import { devicesAPI, locationsAPI } from '../../api'
import './DetailAsset.css'

function DetailInventaris() {
  const navigate = useNavigate()
  const { id, perangkatId } = useParams()
  const toast = useToast()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPerangkat, setFilterPerangkat] = useState('all')
  const [filterKondisi, setFilterKondisi] = useState('all')
  const [activeMenuId, setActiveMenuId] = useState(null)
  const [actionMode, setActionMode] = useState(null) // null | 'edit' | 'delete'
  const [showActionsMenu, setShowActionsMenu] = useState(false)
  const [selectedItems, setSelectedItems] = useState([]) // For multi-select delete
  const [allItems, setAllItems] = useState([])
  const [formData, setFormData] = useState({
    nama: '',
    jenis: '',
    hostname: '',
    merk: '',
    lokasi: '',
    ip: '',
    kondisi: '',
  })
  const [currentData, setCurrentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Import states
  const [importFile, setImportFile] = useState(null)
  const [importLoading, setImportLoading] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const fileInputRef = useRef(null)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch location details
        const location = await locationsAPI.getById(id)

        // Fetch devices for this location
        let devices = await devicesAPI.getByLocation(id)
        devices = devices || []

        // Filter by device type if perangkatId is provided
        if (perangkatId && perangkatId !== 'all') {
          devices = devices.filter(device => device.type === perangkatId)
        }

        // Map API response to component format
        const items = devices.map(device => ({
          id: device.id,
          nama: device.name,
          jenis: device.type,
          hostname: device.name,
          merk: device.serial_number || '-',
          lokasi: device.description || location.name,
          ip: device.ip_address || '-',
          kondisi: device.status === 'active' ? 'SO' : 'TSO',
          status: device.status
        }))

        // Calculate statistics
        const total = items.length
        const aktif = items.filter(item => item.kondisi === 'SO').length
        const nonAktif = items.filter(item => item.kondisi === 'TSO').length

        setCurrentData({
          perangkatNama: perangkatId && perangkatId !== 'all' ? perangkatId : 'Semua Perangkat',
          lokasiNama: location.name,
          total,
          aktif,
          nonAktif
        })
        setAllItems(items)
        setLoading(false)
      } catch (err) {
        setError(err.message || 'Gagal Memuat Data')
        setLoading(false)
      }
    }

    fetchData()
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
    setFormData({ nama: '', jenis: '', hostname: '', merk: '', lokasi: '', ip: '', kondisi: 'SO' })
    setEditingItem(null)
    setShowAddModal(true)
  }

  const handleEditItem = (item) => {
    setFormData({ ...item })
    setEditingItem(item.id)
    setShowEditModal(true)
  }

  const handleSaveItem = async () => {
    if (!formData.jenis || !formData.hostname || !formData.lokasi) {
      toast.warning('Field Jenis, Hostname, dan Lokasi harus diisi!')
      return
    }

    try {
      if (editingItem) {
        // Update existing device
        const deviceData = {
          location_id: id,
          name: formData.hostname,
          type: formData.jenis,
          status: formData.kondisi === 'SO' ? 'active' : 'inactive',
          serial_number: formData.merk,
          description: formData.lokasi,
          ip_address: formData.ip
        }
        
        await devicesAPI.update(editingItem, deviceData)
        
        // Update local state
        setAllItems(allItems.map(item => 
          item.id === editingItem ? { ...formData, id: editingItem } : item
        ))
        
        // Update stats
        const updatedItems = allItems.map(item => 
          item.id === editingItem ? { ...formData, id: editingItem } : item
        )
        const total = updatedItems.length
        const aktif = updatedItems.filter(item => item.kondisi === 'SO').length
        const nonAktif = updatedItems.filter(item => item.kondisi === 'TSO').length
        setCurrentData(prev => ({ ...prev, total, aktif, nonAktif }))
      } else {
        // Create new device
        const deviceData = {
          location_id: id,
          name: formData.hostname,
          type: formData.jenis,
          status: formData.kondisi === 'SO' ? 'active' : 'inactive',
          serial_number: formData.merk,
          description: formData.lokasi,
          ip_address: formData.ip
        }
        
        const newDevice = await devicesAPI.create(deviceData)
        
        // Add to local state
        const newItem = {
          id: newDevice.id,
          nama: newDevice.name,
          jenis: newDevice.type,
          hostname: newDevice.name,
          merk: newDevice.serial_number,
          lokasi: newDevice.description,
          ip: newDevice.ip_address || '-',
          kondisi: newDevice.status === 'active' ? 'SO' : 'TSO'
        }
        
        const updatedItems = [...allItems, newItem]
        setAllItems(updatedItems)
        
        // Update stats
        const total = updatedItems.length
        const aktif = updatedItems.filter(item => item.kondisi === 'SO').length
        const nonAktif = updatedItems.filter(item => item.kondisi === 'TSO').length
        setCurrentData(prev => ({ ...prev, total, aktif, nonAktif }))
      }

      setShowAddModal(false)
      setShowEditModal(false)
      setFormData({ nama: '', jenis: '', hostname: '', merk: '', lokasi: '', ip: '', kondisi: 'SO' })
    } catch (error) {
      toast.error('Gagal menyimpan data: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteItem = (itemId) => {
    const item = allItems.find(i => i.id === itemId)
    setItemToDelete(item)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    // Handle multiple delete
    if (selectedItems.length > 0) {
      try {
        // Use bulk delete API for better performance
        await devicesAPI.bulkDelete(selectedItems)
        
        // Update local state
        const updatedItems = allItems.filter(item => !selectedItems.includes(item.id))
        setAllItems(updatedItems)
        
        // Update stats
        const total = updatedItems.length
        const aktif = updatedItems.filter(item => item.kondisi === 'SO').length
        const nonAktif = updatedItems.filter(item => item.kondisi === 'TSO').length
        setCurrentData(prev => ({ ...prev, total, aktif, nonAktif }))
        
        setShowDeleteModal(false)
        setSelectedItems([])
        setActionMode(null)
      } catch (error) {
        toast.error('Gagal menghapus data: ' + (error.response?.data?.message || error.message))
      }
    } else if (itemToDelete) {
      try {
        await devicesAPI.delete(itemToDelete.id)
        
        // Update local state
        const updatedItems = allItems.filter(item => item.id !== itemToDelete.id)
        setAllItems(updatedItems)
        
        // Update stats
        const total = updatedItems.length
        const aktif = updatedItems.filter(item => item.kondisi === 'SO').length
        const nonAktif = updatedItems.filter(item => item.kondisi === 'TSO').length
        setCurrentData(prev => ({ ...prev, total, aktif, nonAktif }))
        
        setShowDeleteModal(false)
        setItemToDelete(null)
        setActiveMenuId(null)
      } catch (error) {
        toast.error('Gagal menghapus data: ' + (error.response?.data?.message || error.message))
      }
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setItemToDelete(null)
    setSelectedItems([])
  }

  // Toggle item selection
  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => {
      if (actionMode === 'edit') {
        // For edit mode, only allow single selection
        return prev.includes(itemId) ? [] : [itemId]
      } else {
        // For delete mode, allow multiple selection
        return prev.includes(itemId) 
          ? prev.filter(id => id !== itemId)
          : [...prev, itemId]
      }
    })
  }

  // Select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  // Handle delete selected
  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setShowDeleteModal(true)
    }
  }

  // Handle edit selected
  const handleEditSelected = () => {
    if (selectedItems.length === 1) {
      const itemToEdit = allItems.find(item => item.id === selectedItems[0])
      if (itemToEdit) {
        // Set form data dengan nilai dari item yang dipilih
        setFormData({
          nama: itemToEdit.nama || '',
          jenis: itemToEdit.jenis || '',
          hostname: itemToEdit.hostname || '',
          merk: itemToEdit.merk || '',
          lokasi: itemToEdit.lokasi || '',
          ip: itemToEdit.ip || '',
          kondisi: itemToEdit.kondisi || 'SO',
        })
        setEditingItem(selectedItems[0])
        setShowEditModal(true)
        setSelectedItems([])
        setActionMode(null)
      }
    }
  }

  // Handle import file change
  const handleImportFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      const fileExtension = file.name.split('.').pop().toLowerCase()
      const validExtensions = ['csv', 'xls', 'xlsx']
      
      if (!validExtensions.includes(fileExtension)) {
        toast.warning('Format file tidak didukung. Gunakan CSV, XLS, atau XLSX.')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.warning('Ukuran file terlalu besar. Maksimal 10MB.')
        return
      }
      
      setImportFile(file)
      setImportResult(null)
    }
  }

  // Handle import submit
  const handleImportSubmit = async () => {
    if (!importFile) {
      toast.warning('Pilih file terlebih dahulu')
      return
    }

    try {
      setImportLoading(true)
      setImportResult(null)

      const result = await devicesAPI.bulkImport(id, importFile)
      
      // Map API response to component format
      const mappedResult = {
        success: result.inserted || 0,
        failed: (result.total_rows || 0) - (result.inserted || 0),
        errors: (result.errors || []).map((msg, idx) => {
          // Parse error message format: "Baris X: message"
          const match = msg.match(/Baris (\d+): (.+)/)
          if (match) {
            return { row: parseInt(match[1]), message: match[2] }
          }
          return { row: idx + 1, message: msg }
        })
      }
      
      setImportResult(mappedResult)
      
      // If import successful, refresh data
      if (mappedResult.success > 0) {
        // Fetch updated devices
        let devices = await devicesAPI.getByLocation(id)
        devices = devices || []
        
        // Filter by device type if perangkatId is provided
        if (perangkatId && perangkatId !== 'all') {
          devices = devices.filter(device => device.type === perangkatId)
        }

        // Map API response to component format
        const items = devices.map(device => ({
          id: device.id,
          nama: device.name,
          jenis: device.type,
          hostname: device.name,
          merk: device.serial_number || '-',
          lokasi: device.description || currentData.lokasiNama,
          ip: device.ip_address || '-',
          kondisi: device.status === 'active' ? 'SO' : 'TSO',
          status: device.status
        }))

        // Update stats
        const total = items.length
        const aktif = items.filter(item => item.kondisi === 'SO').length
        const nonAktif = items.filter(item => item.kondisi === 'TSO').length

        setAllItems(items)
        setCurrentData(prev => ({ ...prev, total, aktif, nonAktif }))
      }
    } catch (error) {
      setImportResult({
        success: 0,
        failed: 0,
        errors: [{ row: 0, message: error.message || 'Gagal mengimpor data' }]
      })
    } finally {
      setImportLoading(false)
    }
  }

  // Close import modal
  const closeImportModal = () => {
    setShowImportModal(false)
    setImportFile(null)
    setImportResult(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Download template
  const handleDownloadTemplate = async () => {
    try {
      const blob = await devicesAPI.downloadTemplate()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template_import_perangkat.xlsx'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error('Gagal mengunduh template')
    }
  }

  if (loading) {
    return <Loading message="Memuat Detail Perangkat..." />
  }

  if (error) {
    return (
      <div className="detail-Detail-container">
        <div className="Detail-header">
          <Button 
            variant="ghost" 
            className="back-btn" 
            onClick={() => window.handleBackNavigation()}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <h1 className="Detail-title">Error</h1>
        </div>
        <div className="Detail-content">
          <Card variant="outlined" className="error-card">
            <div className="error-content">
              <Badge variant="danger" size="large">Error</Badge>
              <p className="error-message">{error}</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  if (!currentData) {
    return (
      <div className="detail-Detail-container">
        <div className="Detail-header">
          <Button 
            variant="ghost" 
            className="back-btn" 
            onClick={() => window.handleBackNavigation()}
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <h1 className="Detail-title">Data tidak ditemukan</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-Detail-container">
      {/* Blur Background Overlay */}
      {(showAddModal || showEditModal || showDeleteModal || showImportModal) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          pointerEvents: 'none'
        }} />
      )}

      {/* Header */}
      <div className="Detail-header">
        <Button 
          variant="ghost" 
          className="back-btn" 
          onClick={() => window.handleBackNavigation()}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }
        />
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
              <p className="Detail-stat-label">Total Perangkat</p>
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
              <p className="Detail-stat-label">SO (Siap Operasi)</p>
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
            <div className="action-buttons-group">
              <Button 
                variant="success"
                size="medium"
                className="action-btn"
                onClick={handleAddItem}
                title="Tambah item baru"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                }
              >
                <span className="btn-text-responsive">Tambah</span>
              </Button>

              <Button 
                variant="primary"
                size="medium"
                className="action-btn"
                onClick={() => setShowImportModal(true)}
                title="Import dari CSV/Excel"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                <span className="btn-text-responsive">Import</span>
              </Button>

              <Button 
                variant="secondary"
                size="medium"
                className="action-btn"
                onClick={() => {
                  if (actionMode === 'edit') {
                    setActionMode(null)
                    setSelectedItems([])
                  } else {
                    setActionMode('edit')
                  }
                }}
                title={actionMode === 'edit' ? 'Batalkan mode edit' : 'Mode Edit: pilih item untuk mengedit'}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                <span className="btn-text-responsive">Edit</span>
              </Button>

              <Button 
                variant="danger"
                size="medium"
                className="action-btn"
                onClick={() => {
                  if (actionMode === 'delete') {
                    setActionMode(null)
                    setSelectedItems([])
                  } else {
                    setActionMode('delete')
                  }
                }}
                title={actionMode === 'delete' ? 'Batalkan mode hapus' : 'Mode Hapus: pilih item untuk menghapus'}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              >
                <span className="btn-text-responsive">Hapus</span>
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-group">
              <Input
                type="text"
                label="Cari"
                placeholder="Cari Hostname, Lokasi, IP..."
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
                <option value="SO">SO (Siap Operasi)</option>
                <option value="TSO">TSO (Tidak Siap Operasi)</option>
              </select>
            </div>
          </div>

          {/* Selected Items Action Bar */}
          {((actionMode === 'delete' && selectedItems.length > 0) || (actionMode === 'edit' && selectedItems.length > 0)) && (
            <div className="selected-action-bar">
              <span className="selected-count">{selectedItems.length} item dipilih</span>
              <div className="selected-actions">
                <Button 
                  variant="danger" 
                  size="small"
                  onClick={() => setSelectedItems([])}
                >
                  Batal
                </Button>
                {actionMode === 'delete' && (
                  <Button 
                    variant="danger" 
                    size="small"
                    onClick={handleDeleteSelected}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                  >
                    Hapus ({selectedItems.length})
                  </Button>
                )}
                {actionMode === 'edit' && selectedItems.length === 1 && (
                  <Button 
                    variant="secondary" 
                    size="small"
                    onClick={handleEditSelected}
                    icon={
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    }
                  >
                    Edit Item
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Table */}
          <div className="table-wrapper">
            <table className="Detail-table">
              <thead>
                <tr>
                  {(actionMode === 'delete' || actionMode === 'edit') && (
                    <th className="checkbox-cell">
                      {actionMode === 'delete' && (
                        <input 
                          type="checkbox" 
                          checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                          onChange={toggleSelectAll}
                          className="row-checkbox"
                        />
                      )}
                      {actionMode === 'edit' && (
                        <span className="checkbox-header-text">Pilih</span>
                      )}
                    </th>
                  )}
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
                    <tr 
                      key={item.id} 
                      className={selectedItems.includes(item.id) ? 'selected-row' : ''}
                      onClick={(e) => {
                        // Prevent row click when clicking checkbox
                        if (e.target.type === 'checkbox') return
                        
                        if (actionMode === 'edit' || actionMode === 'delete') { 
                          toggleItemSelection(item.id)
                        }
                      }} 
                      style={{ cursor: actionMode ? 'pointer' : 'default' }}
                    >
                      {(actionMode === 'delete' || actionMode === 'edit') && (
                        <td className="checkbox-cell">
                          <input 
                            type="checkbox" 
                            checked={selectedItems.includes(item.id)}
                            onChange={() => toggleItemSelection(item.id)}
                            className="row-checkbox"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                      )}
                      <td className="jenis-cell">{item.jenis || '-'}</td>
                      <td className="hostname-cell">{item.hostname || item.nama || '-'}</td>
                      <td className="merk-cell">{item.merk || '-'}</td>
                      <td className="lokasi-cell">{item.lokasi}</td>
                      <td className="ip-cell">{item.ip || '-'}</td>
                      <td className="kondisi-cell">
                        <Badge variant={item.kondisi === 'SO' ? 'success' : 'danger'} size="small">
                          {item.kondisi || '-'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                      <td colSpan={actionMode === 'delete' ? 7 : 6} className="empty-state">Tidak ada data</td>
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
              variant="danger"
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
            placeholder="Masukkan Jenis Perangkat"
            value={formData.jenis}
            onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}
          />

          <Input
            label="Hostname"
            placeholder="Masukkan Hostname"
            value={formData.hostname}
            onChange={(e) => setFormData({ ...formData, hostname: e.target.value })}
          />

          <Input
            label="Merk / Spek"
            placeholder="Masukkan Merk Atau Spesifikasi"
            value={formData.merk}
            onChange={(e) => setFormData({ ...formData, merk: e.target.value })}
          />

          <Input
            label="Lokasi"
            placeholder="Masukkan Lokasi"
            value={formData.lokasi}
            onChange={(e) => setFormData({ ...formData, lokasi: e.target.value })}
          />

          <Input
            label="IP Perangkat"
            placeholder="Masukkan IP Perangkat"
            value={formData.ip}
            onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
          />

          <Input
            label="Kondisi"
            placeholder="Masukkan Kondisi (Mis. SO, TSO...)"
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
        title={selectedItems.length > 1 ? `Hapus ${selectedItems.length} Item` : 'Konfirmasi Hapus'}
        size="small"
        footer={
          <>
            <Button
              variant="danger"
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
              Hapus {selectedItems.length > 1 ? `(${selectedItems.length})` : ''}
            </Button>
          </>
        }
      >
        {selectedItems.length > 0 ? (
          <div style={{ padding: '10px 0' }}>
            <p style={{ marginBottom: '15px', color: 'var(--text-main)' }}>
              Apakah Anda yakin ingin menghapus <strong>{selectedItems.length}</strong> item yang dipilih?
            </p>
            <div style={{ 
              background: 'var(--gray-50)', 
              padding: '12px', 
              borderRadius: '8px',
              border: '1px solid var(--border-light)',
              maxHeight: '200px',
              overflowY: 'auto'
            }}>
              {selectedItems.map((itemId, index) => {
                const item = allItems.find(i => i.id === itemId)
                return item ? (
                  <div key={itemId} style={{ 
                    padding: '8px 0', 
                    borderBottom: index < selectedItems.length - 1 ? '1px solid var(--border-light)' : 'none'
                  }}>
                    <p style={{ margin: '0', fontWeight: '500', fontSize: '14px', color: 'var(--text-main)' }}>
                      {item.hostname || item.nama || '-'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {item.jenis} • {item.lokasi}
                    </p>
                  </div>
                ) : null
              })}
            </div>
            <p style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        ) : itemToDelete && (
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
                {itemToDelete.hostname || itemToDelete.nama}
              </p>
              <p style={{ margin: '0', fontSize: '14px', color: 'var(--text-secondary)' }}>
                {itemToDelete.jenis} • Lokasi: {itemToDelete.lokasi}
              </p>
            </div>
            <p style={{ marginTop: '15px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        )}
      </Modal>

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={closeImportModal}
        title="Import Data Perangkat"
        size="medium"
        footer={
          <>
            <Button
              variant="danger"
              onClick={closeImportModal}
              disabled={importLoading}
            >
              {importResult ? 'Tutup' : 'Batal'}
            </Button>
            {!importResult && (
              <Button
                variant="success"
                onClick={handleImportSubmit}
                disabled={!importFile || importLoading}
              >
                {importLoading ? 'Mengimpor...' : 'Import'}
              </Button>
            )}
          </>
        }
      >
        <div className="import-modal-content">
          {!importResult ? (
            <>
              {/* File Upload Section */}
              <div className="import-section">
                <label className="import-label">Pilih File (CSV/Excel)</label>
                <div 
                  className="import-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xls,.xlsx"
                    onChange={handleImportFileChange}
                    style={{ display: 'none' }}
                  />
                  {importFile ? (
                    <div className="import-file-selected">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="import-filename">{importFile.name}</span>
                      <span className="import-filesize">({(importFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <div className="import-placeholder">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p>Klik untuk memilih file</p>
                      <span>atau drag & drop file di sini</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Format Info Section */}
              <div className="import-section">
                <label className="import-label">Format yang Didukung</label>
                <div className="import-format-info">
                  <div className="format-badges">
                    <Badge variant="info" size="small">CSV</Badge>
                    <Badge variant="info" size="small">XLS</Badge>
                    <Badge variant="info" size="small">XLSX</Badge>
                  </div>
                  <p className="format-description">
                    Maksimal ukuran file: <strong>10MB</strong>
                  </p>
                </div>
              </div>

              {/* Column Info Section */}
              <div className="import-section">
                <label className="import-label">Kolom yang Diperlukan</label>
                <div className="import-columns-info">
                  <table className="import-columns-table">
                    <thead>
                      <tr>
                        <th>Nama Kolom</th>
                        <th>Wajib</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><code>jenis_perangkat</code></td>
                        <td><Badge variant="danger" size="small">Ya</Badge></td>
                        <td>Jenis perangkat (Router, Switch, dll)</td>
                      </tr>
                      <tr>
                        <td><code>hostname</code></td>
                        <td><Badge variant="danger" size="small">Ya</Badge></td>
                        <td>Nama/hostname perangkat</td>
                      </tr>
                      <tr>
                        <td><code>merk_spek</code></td>
                        <td><Badge variant="secondary" size="small">Tidak</Badge></td>
                        <td>Merk atau spesifikasi</td>
                      </tr>
                      <tr>
                        <td><code>ip_perangkat</code></td>
                        <td><Badge variant="secondary" size="small">Tidak</Badge></td>
                        <td>Alamat IP perangkat</td>
                      </tr>
                      <tr>
                        <td><code>lokasi</code></td>
                        <td><Badge variant="secondary" size="small">Tidak</Badge></td>
                        <td>Lokasi detail perangkat</td>
                      </tr>
                      <tr>
                        <td><code>kondisi</code></td>
                        <td><Badge variant="secondary" size="small">Tidak</Badge></td>
                        <td>SO atau TSO (default: SO)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Download Template */}
              <div className="import-section">
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleDownloadTemplate}
                  icon={
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                >
                  Download Template Excel
                </Button>
              </div>

              {importLoading && (
                <div className="import-loading">
                  <div className="import-spinner"></div>
                  <p>Sedang mengimpor data...</p>
                </div>
              )}
            </>
          ) : (
            /* Import Result */
            <div className="import-result">
              <div className="import-result-summary">
                <div className="result-stat success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <span className="result-number">{importResult.success}</span>
                    <span className="result-label">Berhasil</span>
                  </div>
                </div>
                <div className="result-stat failed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <span className="result-number">{importResult.failed}</span>
                    <span className="result-label">Gagal</span>
                  </div>
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="import-errors">
                  <label className="import-label">Detail Error</label>
                  <div className="errors-list">
                    {importResult.errors.map((err, index) => (
                      <div key={index} className="error-item">
                        <Badge variant="danger" size="small">Baris {err.row}</Badge>
                        <span>{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importResult.success > 0 && (
                <div className="import-success-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Data berhasil diimpor dan tabel sudah diperbarui.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default DetailInventaris
