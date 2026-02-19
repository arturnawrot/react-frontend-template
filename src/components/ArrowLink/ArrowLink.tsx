import React from 'react'
import Link from 'next/link'
import Arrow from '../Arrow/Arrow'
import { isInternalLink } from '@/utils/link-utils'

interface ArrowLinkProps {
  href: string
  children: React.ReactNode
  openInNewTab?: boolean
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export default function ArrowLink({ href, children, openInNewTab = false, className = '', style, disabled = false }: ArrowLinkProps) {
  const isInternal = isInternalLink(href) && !openInNewTab
  const LinkComponent = isInternal ? Link : 'a'
  
  const baseClassName = 'inline-flex items-center gap-2 text-[#1a2e2a] hover:opacity-70 transition-opacity'
  const disabledClassName = disabled ? 'opacity-50 cursor-not-allowed hover:opacity-50' : ''
  const combinedClassName = className ? `${baseClassName} ${disabledClassName} ${className}`.trim() : `${baseClassName} ${disabledClassName}`.trim()
  
  const baseStyle: React.CSSProperties = {
    fontFamily: 'GT America, sans-serif',
    fontWeight: 400,
    fontSize: 'var(--l)',
    lineHeight: '100%',
    letterSpacing: '0%',
    ...style,
  }

  // If disabled, render as span instead of link
  if (disabled) {
    return (
      <span className={combinedClassName} style={baseStyle} aria-disabled="true">
        {children}
        <Arrow direction="right" variant="fill" size={16} />
      </span>
    )
  }
  
  const linkProps = isInternal
    ? {
        href,
        className: combinedClassName,
        style: baseStyle,
      }
    : {
        href,
        target: openInNewTab ? '_blank' : undefined,
        rel: openInNewTab ? 'noopener noreferrer' : undefined,
        className: combinedClassName,
        style: baseStyle,
      }

  return (
    <LinkComponent {...linkProps}>
      {children}
      <Arrow direction="right" variant="fill" size={16} />
    </LinkComponent>
  )
}
