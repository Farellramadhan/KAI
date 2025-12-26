import React, { useEffect } from 'react'
import './Modal.css'

/**
 * Reusable Modal Component
 * @param {boolean} isOpen - Control modal visibility
 * @param {function} onClose - Close handler
 * @param {string} title - Modal title
 * @param {string} size - 'small' | 'medium' | 'large' | 'fullscreen'
 * @param {boolean} closeOnOverlay - Close when clicking overlay
 * @param {boolean} showCloseButton - Show close (X) button
 * @param {React.ReactNode} header - Custom header content (overrides title)
 * @param {React.ReactNode} footer - Footer content
 * @param {React.ReactNode} children - Modal body content
 */
const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  size = 'medium',
  closeOnOverlay = true,
  showCloseButton = true,
  header = null,
  footer = null,
  children,
  className = '',
  ...props
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  const modalClasses = [
    'modal-content',
    `modal-${size}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} {...props}>
      <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        {(header || title || showCloseButton) && (
          <div className="modal-header">
            {header ? header : title && <h2 className="modal-title">{title}</h2>}
            {showCloseButton && (
              <button className="modal-close" onClick={onClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal
