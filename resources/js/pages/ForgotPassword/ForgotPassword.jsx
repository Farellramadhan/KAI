import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Loading, Card } from '../../components'
import { authAPI } from '../../api'
import './ForgotPassword.css'

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: verify code, 3: new password
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [resendTimer, setResendTimer] = useState(0) // Timer in seconds

  // Countdown timer effect
  useEffect(() => {
    let interval = null
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  // Step 1: Request reset code
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authAPI.forgotPassword({ email })
      setSuccess('Kode verifikasi telah dikirim ke email Anda.')
      setStep(2)
      setResendTimer(300) // Start 5-minute (300 seconds) countdown
    } catch (err) {
      setError(err.message || 'Gagal mengirim kode verifikasi. Pastikan email terdaftar.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authAPI.verifyResetCode({ email, code })
      setSuccess('Kode verifikasi valid. Silakan buat password baru.')
      setStep(3)
    } catch (err) {
      setError(err.message || 'Kode verifikasi tidak valid atau sudah kadaluarsa.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.')
      return
    }

    if (newPassword.length < 6) {
      setError('Password minimal 6 karakter.')
      return
    }

    setLoading(true)

    try {
      await authAPI.resetPassword({ 
        email, 
        code, 
        password: newPassword,
        password_confirmation: confirmPassword 
      })
      setSuccess('Password berhasil direset. Silakan login dengan password baru.')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (err) {
      setError(err.message || 'Gagal mereset password. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleNavigateToLogin = (e) => {
    e.preventDefault()
    setIsTransitioning(true)
    setTimeout(() => {
      navigate('/login', { replace: true })
    }, 300)
  }

  const handleResendCode = async () => {
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await authAPI.forgotPassword({ email })
      setSuccess('Kode verifikasi baru telah dikirim ke email Anda.')
      setResendTimer(300) // Restart 5-minute countdown
    } catch (err) {
      setError(err.message || 'Gagal mengirim ulang kode verifikasi.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
        <div className="step-number">
          {step > 1 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : '1'}
        </div>
        <span className="step-label">Email</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
        <div className="step-number">
          {step > 2 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : '2'}
        </div>
        <span className="step-label">Verifikasi</span>
      </div>
      <div className="step-line"></div>
      <div className={`step ${step >= 3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        <span className="step-label">Password Baru</span>
      </div>
    </div>
  )

  return (
    <>
      {loading && <Loading message="Memproses..." />}
      <div className={`forgot-password-container ${isTransitioning ? 'fade-out' : ''}`}>
        <div className="forgot-password-box">
          <div className="logo-section">
            <div className="logo">
              <img src="/image/logo.png" alt="KAI Logo" />
            </div>
          </div>

          <div className="forgot-password-header">
            <h1>Lupa Password</h1>
            <p>
              {step === 1 && 'Masukkan email Anda untuk menerima kode verifikasi.'}
              {step === 2 && 'Masukkan kode verifikasi yang dikirim ke email Anda.'}
              {step === 3 && 'Buat password baru untuk akun Anda.'}
            </p>
          </div>

          {renderStepIndicator()}

          {error && (
            <Card variant="flat" className="message-card error">
              <div className="message-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span>{error}</span>
              </div>
            </Card>
          )}

          {success && (
            <Card variant="flat" className="message-card success">
              <div className="message-content">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{success}</span>
              </div>
            </Card>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleRequestCode} className="forgot-password-form">
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

              <Button type="submit" variant="success" size="large" fullWidth disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}
              </Button>
            </form>
          )}

          {/* Step 2: Verify Code Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="forgot-password-form">
              <Input
                type="text"
                label="Kode Verifikasi"
                placeholder="Masukkan 6 Digit Kode"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                disabled={loading}
                maxLength={6}
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />

              <Button type="submit" variant="success" size="large" fullWidth disabled={loading || code.length !== 6}>
                {loading ? 'Memverifikasi...' : 'Verifikasi Kode'}
              </Button>

              <div className="resend-code">
                {resendTimer > 0 ? (
                  <span>
                    Kirim ulang kode dalam {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <>
                    <span>Tidak menerima kode? </span>
                    <button type="button" onClick={handleResendCode} disabled={loading}>
                      Kirim Ulang
                    </button>
                  </>
                )}
              </div>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="forgot-password-form">
              <Input
                type="password"
                label="Password Baru"
                placeholder="Minimal 6 Karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={loading}
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />

              <Input
                type="password"
                label="Konfirmasi Password"
                placeholder="Ulangi Password Baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                leftIcon={
                  <svg viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                }
              />

              <Button type="submit" variant="success" size="large" fullWidth disabled={loading}>
                {loading ? 'Menyimpan...' : 'Reset Password'}
              </Button>
            </form>
          )}

          <div className="back-to-login">
            <a href="/login" onClick={handleNavigateToLogin}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Kembali ke Login
            </a>
          </div>

          <footer className="footer">
            <p>© 2025 KAI</p>
          </footer>
        </div>

        <div className="image-section">
          <img src="/image/bg-login.png" alt="Train" />
        </div>
      </div>
    </>
  )
}

export default ForgotPassword
