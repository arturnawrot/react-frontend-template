import React from 'react'
import BaseButton from './BaseButton'
import styles from './SecondaryButton.module.scss'

interface SecondaryButtonProps {
  children: React.ReactNode
  href?: string | null
  onClick?: () => void
  openInNewTab?: boolean
  className?: string
  fullWidth?: boolean
}

export default function SecondaryButton({
  children,
  href,
  onClick,
  openInNewTab = false,
  className = '',
  fullWidth = false,
}: SecondaryButtonProps) {
  const fullWidthClass = fullWidth ? styles.fullWidth : ''
  const combinedClassName = `${styles.button} ${fullWidthClass} ${className}`.trim()

  return (
    <BaseButton
      href={href}
      onClick={onClick}
      openInNewTab={openInNewTab}
      className={combinedClassName}
      fullWidth={fullWidth}
    >
      {children}
    </BaseButton>
  )
}
