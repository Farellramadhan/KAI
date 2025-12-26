import React, { useState, useEffect } from 'react'
import './Loading.css'

const Loading = ({ message = "Loading", onComplete }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onComplete, 300) // Wait for fade-out animation
      }, 500) // Minimum display time

      return () => clearTimeout(timer)
    }
  }, [onComplete])

  return (
    <div className={`loading-screen ${!isVisible ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <div className="loading-logo">
          <img src="/image/logo.png" alt="KAI Logo" className="kai-logo" />
        </div>
        <div className="loading-text">
          {message}
        </div>
        <div className="loading-spinner"></div>
      </div>
    </div>
  )
}

export default Loading