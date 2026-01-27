import React from 'react'
import Link from 'next/link'
import { isInternalLink } from '@/utils/link-utils'

interface BaseButtonProps {
  children: React.ReactNode
  href?: string | null
  onClick?: () => void
  openInNewTab?: boolean
  className?: string
  fullWidth?: boolean
}

/**
 * Base button component that handles both link and button rendering
 * Used by PrimaryButton and SecondaryButton to avoid code duplication
 */
export default function BaseButton({
  children,
  href,
  onClick,
  openInNewTab = false,
  className = '',
  fullWidth = false,
}: BaseButtonProps) {
  const fullWidthClass = fullWidth ? 'w-full md:w-auto' : ''
  const baseClassName = `${className} ${fullWidthClass}`.trim()

  // If href is provided, render as link
  if (href) {
    const isInternal = isInternalLink(href) && !openInNewTab
    const LinkComponent = isInternal ? Link : 'a'
    const linkProps = isInternal
      ? { href, className: baseClassName }
      : {
          href,
          target: openInNewTab ? '_blank' : undefined,
          rel: openInNewTab ? 'noopener noreferrer' : undefined,
          className: baseClassName,
        }
    return <LinkComponent {...linkProps}>{children}</LinkComponent>
  }

  // Otherwise render as button
  return (
    <button onClick={onClick} className={baseClassName} type="button">
      {children}
    </button>
  )
}
