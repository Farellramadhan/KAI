import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import Home from './pages/Home/Home'
import DetailAset from './pages/LocationDetail/LocationDetail'
import DetailInventaris from './pages/DetailAsset/DetailAsset'
import { Loading } from './components'
import { authAPI } from './api'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()

  // Prevent going back from home page but allow forward navigation
  useEffect(() => {
    // When arriving at home, mark it as a navigation boundary
    if (location.pathname === '/home' && isAuthenticated) {
      // Replace the current state to mark this as a boundary
      window.history.replaceState({
        page: 'home',
        boundary: true,
        timestamp: Date.now()
      }, 'Home', '/home')
    }

    // Handle browser navigation
    const handlePopState = (event) => {
      if (location.pathname === '/home' && isAuthenticated) {
        const state = event.state || {}

        // If this state doesn't have our boundary marker, it means
        // someone tried to navigate back from home
        if (!state.boundary) {
          // Prevent the navigation and stay on home
          window.history.pushState({
            page: 'home',
            boundary: true,
            timestamp: Date.now()
          }, 'Home', '/home')

          // Prevent the default behavior
          event.preventDefault()
          event.stopImmediatePropagation()
          return false
        }
      }
    }

    window.addEventListener('popstate', handlePopState, { capture: true, passive: false })

    return () => {
      window.removeEventListener('popstate', handlePopState, { capture: true, passive: false })
    }
  }, [location.pathname, isAuthenticated])

  useEffect(() => {
    // Skip auth check for login and register pages
    if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password') {
      setLoading(false)
      return
    }

    const checkAuth = async () => {
      try {
        const response = await authAPI.getUser()
        setUserData(response)
        setIsAuthenticated(true)
      } catch (error) {
        // If not authenticated, stay not authenticated
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [location.pathname])

  const handleLogin = (user) => {
    setUserData(user)
    setIsAuthenticated(true)
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Silent fail for logout
    }
    setUserData(null)
    setIsAuthenticated(false)
  }

  // Smart back navigation that returns from inventory to its location, otherwise to home
  const handleBackNavigation = () => {
    const inventoryMatch = location.pathname.match(/^\/location\/([^/]+)\/inventory$/)

    if (inventoryMatch) {
      // From inventory detail, go back to the parent location detail
      navigate(`/location/${inventoryMatch[1]}`, { replace: true })
      return
    }

    if (location.pathname === '/home') {
      // Already at home, stay here
      return
    }

    // Default: go back to home
    navigate('/home', { replace: true })
  }

  // Expose the back navigation function globally so detail pages can use it
  useEffect(() => {
    window.handleBackNavigation = handleBackNavigation
    return () => {
      delete window.handleBackNavigation
    }
  }, [location.pathname, navigate])

  if (loading) {
    return <Loading message="Memuat..." />
  }

  return (
    <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/home" /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/home" /> : 
            <Register />
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            isAuthenticated ? 
            <Navigate to="/home" /> : 
            <ForgotPassword />
          } 
        />
        <Route 
          path="/home" 
          element={
            isAuthenticated ? 
            <Home user={userData} onLogout={handleLogout} /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        <Route 
          path="/location/:id" 
          element={
            isAuthenticated ? 
            <DetailAset /> : 
            <Navigate to="/" />
          } 
        />
        <Route 
          path="/location/:id/inventory" 
          element={
            isAuthenticated ? 
            <DetailInventaris /> : 
            <Navigate to="/" />
          } 
        />
      </Routes>
  )
}

export default App
