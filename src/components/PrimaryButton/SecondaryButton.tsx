import React from 'react'
import type { ResolvedLink } from '@/utils/linkResolver'
import BaseButton from './BaseButton'
import styles from './SecondaryButton.module.scss'

interface SecondaryButtonProps {
  children: React.ReactNode
  link?: ResolvedLink
  href?: string | null
  onClick?: () => void
  openInNewTab?: boolean
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  calLink?: string | null
  calNamespace?: string | null
}

export default function SecondaryButton({
  children,
  link,
  href,
  onClick,
  openInNewTab = false,
  className = '',
  fullWidth = false,
  disabled = false,
  calLink,
  calNamespace,
}: SecondaryButtonProps) {
  const fullWidthClass = fullWidth ? styles.fullWidth : ''
  const combinedClassName = `${styles.button} ${fullWidthClass} ${className}`.trim()

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
