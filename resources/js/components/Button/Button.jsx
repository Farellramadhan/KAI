import React from 'react'
import './Button.css'

/**
 * Reusable Button Component
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'success' | 'outline'
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} disabled - Disable button
 * @param {boolean} fullWidth - Full width button
 * @param {React.ReactNode} icon - Icon element (SVG)
 * @param {string} iconPosition - 'left' | 'right'
 * @param {function} onClick - Click handler
 * @param {string} type - 'button' | 'submit' | 'reset'
 * @param {React.ReactNode} children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    disabled && 'btn-disabled',
    icon && 'btn-with-icon',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="btn-icon btn-icon-left">{icon}</span>}
      {children && <span className="btn-text">{children}</span>}
      {icon && iconPosition === 'right' && <span className="btn-icon btn-icon-right">{icon}</span>}
    </button>
  )
}

export default Button
