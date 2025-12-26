import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components'
import { authAPI } from '../../api'
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok!')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter!')
      return
    }

    setLoading(true)
    
    try {
      await authAPI.register({
        name: formData.nama,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      })
      
      alert('Registrasi berhasil! Silakan login.')
      setIsTransitioning(true)
      setTimeout(() => {
        navigate('/')
      }, 300)
    } catch (err) {
      console.error('Register error:', err)
      setError(err.message || 'Registrasi gagal. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToLogin = (e) => {
    e.preventDefault()
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/')
    }, 300)
  }

  return (
    <div className={`register-container ${isTransitioning ? 'fade-out' : ''}`}>
      <div className="image-section">
        <img src="/image/bg-login.png" alt="Train" />
      </div>
      <div className="register-box">
        <div className="logo-section">
          <div className="logo">
            <img src="/image/logo.png" alt="Train Logo" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {error && (
            <div className="error-message" style={{
              padding: '12px',
              backgroundColor: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <Input
            type="text"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={formData.nama}
            onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
            required
            disabled={loading}
            leftIcon={
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          />

          <Input
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            disabled={loading}
            leftIcon={
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                <path d="m22 6-10 7L2 6" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          />

          <Input
            type="password"
            label="Password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            minLength={6}
            required
            disabled={loading}
            helperText="Minimal 6 karakter"
            leftIcon={
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          />

          <Input
            type="password"
            label="Konfirmasi Password"
            placeholder="Ulangi password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            minLength={6}
            required
            disabled={loading}
            error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Password tidak cocok' : ''}
            leftIcon={
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          />

          <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar'}
          </Button>

          <div className="login-link">
            <p>Sudah punya akun? <a href="/" onClick={handleNavigateToLogin}>Login di sini</a></p>
          </div>
        </form>

        <footer className="footer">
          <p>© 2025 KAI</p>
        </footer>
      </div>
    </div>
  )
}

export default Register
