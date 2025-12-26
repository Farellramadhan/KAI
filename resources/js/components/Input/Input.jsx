import React from 'react'
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
  ...props
}) => {
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
    rightIcon && 'input-with-right-icon'
  ].filter(Boolean).join(' ')

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
          type={type}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...props}
        />
        
        {rightIcon && <span className="input-icon input-icon-right">{rightIcon}</span>}
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
