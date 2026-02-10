import React, { useState } from 'react'
import './Input.css'

/**
 * Reusable Input Component
 * @param {string} type - Input type (text, email, password, number, etc.)
 * @param {string} label - Input label
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {boolean} required - Required field
 * @param {boolean} disabled - Disabled state
 * @param {boolean} fullWidth - Full width input
 * @param {React.ReactNode} leftIcon - Left icon element
 * @param {React.ReactNode} rightIcon - Right icon element
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {boolean} showPasswordToggle - Show toggle for password visibility
 */
const Input = ({
  type = 'text',
  label = '',
  placeholder = '',
  value = '',
  onChange,
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  size = 'medium',
  className = '',
  showPasswordToggle = true,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordType = type === 'password'
  const actualType = isPasswordType && showPassword ? 'text' : type

  const inputWrapperClasses = [
    'input-wrapper',
    fullWidth && 'input-full-width',
    error && 'input-error',
    disabled && 'input-disabled',
    className
  ].filter(Boolean).join(' ')

  const inputClasses = [
    'input-field',
    `input-${size}`,
    leftIcon && 'input-with-left-icon',
    (rightIcon || (isPasswordType && showPasswordToggle)) && 'input-with-right-icon'
  ].filter(Boolean).join(' ')

  const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

  return (
    <div className={inputWrapperClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-container">
        {leftIcon && <span className="input-icon input-icon-left">{leftIcon}</span>}
        
        <input
          type={actualType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {isPasswordType && showPasswordToggle ? (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
      </div>
      
      {(error || helperText) && (
        <span className={error ? 'input-error-text' : 'input-helper-text'}>
          {error || helperText}
        </span>
      )}
    </div>
  )
}

export default Input
