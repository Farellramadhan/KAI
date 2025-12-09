import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components'
import './Login.css'

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
    // Extract username from email (part before @)
    const username = email.split('@')[0]
    
    // Cek apakah ada data registrasi di localStorage
    const userRegistration = localStorage.getItem('userRegistration')
    let userData = { email, username }
    
    if (userRegistration) {
      const registered = JSON.parse(userRegistration)
      // Jika email cocok, ambil nama dari registrasi
      if (registered.email === email) {
        userData.name = registered.nama
      }
    }
    
    onLogin(userData)
  }

  const handleNavigateToRegister = (e) => {
    e.preventDefault()
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/register')
    }, 300)
  }

  return (
    <div className={`login-container ${isTransitioning ? 'fade-out' : ''}`}>
      <div className="login-box">
        <div className="logo-section">
          <div className="logo">
            <img src="/image/logo.png" alt="Train Logo" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <Input
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            }
          />

          <div className="forgot-password">
            <a href="#forgot">Lupa Password?</a>
          </div>

          <Button type="submit" variant="primary" size="large" fullWidth>
            Login
          </Button>

          <div className="register-link">
            <p>Belum punya akun? <a href="/register" onClick={handleNavigateToRegister}>Daftar di sini</a></p>
          </div>
        </form>

        <footer className="footer">
          <p>© 2025 KAI</p>
        </footer>
      </div>

      <div className="image-section">
        <img src="/image/bg-login.png" alt="Train" />
      </div>
    </div>
  )
}

export default Login
