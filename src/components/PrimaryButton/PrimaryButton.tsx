import React from 'react'
import type { ResolvedLink } from '@/utils/linkResolver'
import BaseButton from './BaseButton'
import styles from './PrimaryButton.module.scss'

interface PrimaryButtonProps {
  children: React.ReactNode
  link?: ResolvedLink
  href?: string | null
  onClick?: () => void
  openInNewTab?: boolean
  className?: string
  fullWidth?: boolean
  variant?: 'default' | 'dark'
  disabled?: boolean
  calLink?: string | null
  calNamespace?: string | null
}

export default function PrimaryButton({
  children,
  link,
  href,
  onClick,
  openInNewTab = false,
  className = '',
  fullWidth = false,
  variant = 'default',
  disabled = false,
  calLink,
  calNamespace,
}: PrimaryButtonProps) {
  const variantClass = variant === 'dark' ? styles.buttonDark : styles.button
  const fullWidthClass = fullWidth ? styles.fullWidth : ''
  const combinedClassName = `${variantClass} ${fullWidthClass} ${className}`.trim()

  return (
    <BaseButton
      link={link}
      href={href}
      onClick={onClick}
      openInNewTab={openInNewTab}
      className={combinedClassName}
      fullWidth={fullWidth}
      disabled={disabled}
      calLink={calLink}
      calNamespace={calNamespace}
    >
      {children}
    </BaseButton>
  )
}
