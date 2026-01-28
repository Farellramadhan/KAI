import React from 'react'
import './Badge.css'

/**
 * Reusable Badge Component
 * @param {string} variant - 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gray'
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} dot - Show dot indicator
 * @param {React.ReactNode} icon - Icon element
 * @param {React.ReactNode} children - Badge content
 */
const Badge = ({
  variant = 'primary',
  size = 'medium',
  dot = false,
  icon = null,
  children,
  className = '',
  ...props
}) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    dot && 'badge-dot',
    className
  ].filter(Boolean).join(' ')

  return (
    <span className={badgeClasses} {...props}>
      {dot && <span className="badge-dot-indicator"></span>}
      {icon && <span className="badge-icon">{icon}</span>}
      {children && <span className="badge-text">{children}</span>}
    </span>
  )
}

export default Badge
