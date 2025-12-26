import React from 'react'
import './Card.css'

/**
 * Reusable Card Component
 * @param {string} variant - 'default' | 'elevated' | 'outlined' | 'flat'
 * @param {boolean} hoverable - Add hover effect
 * @param {boolean} clickable - Add cursor pointer
 * @param {function} onClick - Click handler
 * @param {React.ReactNode} header - Card header content
 * @param {React.ReactNode} footer - Card footer content
 * @param {React.ReactNode} children - Card body content
 * @param {string} padding - 'none' | 'small' | 'medium' | 'large'
 */
const Card = ({
  variant = 'default',
  hoverable = false,
  clickable = false,
  onClick,
  header = null,
  footer = null,
  children,
  padding = 'medium',
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    hoverable && 'card-hoverable',
    clickable && 'card-clickable',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {header && <div className="card-header">{header}</div>}
      {children && <div className="card-body">{children}</div>}
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  )
}

export default Card
