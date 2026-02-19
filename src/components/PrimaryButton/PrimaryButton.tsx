import React from 'react'
import BaseButton from './BaseButton'
import styles from './PrimaryButton.module.scss'

interface PrimaryButtonProps {
  children: React.ReactNode
  href?: string | null
  onClick?: () => void
  openInNewTab?: boolean
  className?: string
  fullWidth?: boolean
  variant?: 'default' | 'dark'
  disabled?: boolean
}

export default function PrimaryButton({
  children,
  href,
  onClick,
  openInNewTab = false,
  className = '',
  fullWidth = false,
  variant = 'default',
  disabled = false,
}: PrimaryButtonProps) {
  const variantClass = variant === 'dark' ? styles.buttonDark : styles.button
  const fullWidthClass = fullWidth ? styles.fullWidth : ''
  const combinedClassName = `${variantClass} ${fullWidthClass} ${className}`.trim()

  return (
    <BaseButton
      href={href}
      onClick={onClick}
      openInNewTab={openInNewTab}
      className={combinedClassName}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {children}
    </BaseButton>
  )
}
