import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button, Input, Loading, Card } from '../../components'
import { authAPI } from '../../api'
import './Login.css'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const response = await authAPI.login({ email, password })
      
      // Extract username from email (part before @)
      const username = email.split('@')[0]
      
      const userData = {
        email,
        username,
        name: response.user?.name || response.user?.nama || username,
        id: response.user?.id
      }
      
      onLogin(userData)
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message || 'Email atau password salah. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToRegister = (e) => {
    e.preventDefault()
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/register', { replace: true })
    }, 300)
  }

  const handleNavigateToForgotPassword = (e) => {
    e.preventDefault()
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/forgot-password', { replace: true })
    }, 300)
  }

  return (
    <>
      {loading ? (
        <Loading message="Login..." />
      ) : (
        <div className={`login-container ${isTransitioning ? 'fade-out' : ''}`}>
          <div className="login-box">
        <div className="logo-section">
          <div className="logo">
            <img src="/image/logo.png" alt="Train Logo" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <Card variant="flat" className="error-message-card">
              <div className="error-message-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            </Card>
          )}

          <Input
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Masukkan Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            leftIcon={
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          />

          <div className="forgot-password">
            <a href="/forgot-password" onClick={handleNavigateToForgotPassword}>Lupa Password?</a>
          </div>

          <Button type="submit" variant="primary" size="large" fullWidth disabled={loading}>
            {loading ? 'Memproses...' : 'Login'}
          </Button>

          <div className="register-link">
            <p>Belum punya akun? <a href="/register" onClick={handleNavigateToRegister}>Daftar di sini</a></p>
          </div>
        </form>

        <footer className="footer">
          <p>© 2025 KAI DAOP 6</p>
        </footer>
      </div>

      <div className="image-section">
        <img src="/image/bg-login.png" alt="Train" />
      </div>
        </div>
      )}
    </>
  )
}

export default Login
