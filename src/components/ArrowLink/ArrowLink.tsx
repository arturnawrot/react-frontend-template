import React from 'react'
import Link from 'next/link'
import type { ResolvedLink } from '@/utils/linkResolver'
import Arrow from '../Arrow/Arrow'
import { isInternalLink } from '@/utils/link-utils'
import CalNamespaceInit from '@/components/CalNamespaceInit'

interface ArrowLinkProps {
  link?: ResolvedLink       // CMS-resolved link — overrides individual link props
  href?: string             // Static href for non-CMS use
  children: React.ReactNode
  openInNewTab?: boolean
  className?: string
  style?: React.CSSProperties
  disabled?: boolean
}

export default function ArrowLink({ link, href, children, openInNewTab = false, className = '', style, disabled = false }: ArrowLinkProps) {
  const effectiveHref = link?.href ?? href
  const effectiveOpenInNewTab = link?.openInNewTab ?? openInNewTab
  const effectiveDisabled = link?.disabled ?? disabled
  const effectiveCalLink = link?.calLink
  const effectiveCalNamespace = link?.calNamespace

  const baseClassName = 'inline-flex items-center gap-2 text-[#1a2e2a] hover:opacity-70 transition-opacity'
  const disabledClassName = effectiveDisabled ? 'opacity-50 cursor-not-allowed hover:opacity-50' : ''
  const combinedClassName = className ? `${baseClassName} ${disabledClassName} ${className}`.trim() : `${baseClassName} ${disabledClassName}`.trim()

  const baseStyle: React.CSSProperties = {
    fontFamily: 'GT America, sans-serif',
    fontWeight: 400,
    fontSize: 'var(--l)',
    lineHeight: '100%',
    letterSpacing: '0%',
    ...style,
  }

  if (effectiveCalLink) {
    return (
      <>
        {effectiveCalNamespace && <CalNamespaceInit namespace={effectiveCalNamespace} />}
        <button
          type="button"
          className={`${combinedClassName} cursor-pointer`}
          style={baseStyle}
          data-cal-link={effectiveCalLink}
          data-cal-namespace={effectiveCalNamespace ?? undefined}
          data-cal-config='{"layout":"month_view"}'
        >
          {children}
          <Arrow direction="right" variant="fill" size={16} />
        </button>
      </>
    )
  }

  if (effectiveDisabled) {
    return (
      <span className={combinedClassName} style={baseStyle} aria-disabled="true">
        {children}
        <Arrow direction="right" variant="fill" size={16} />
      </span>
    )
  }

  if (!effectiveHref) {
    return null
  }

  const isInternal = isInternalLink(effectiveHref) && !effectiveOpenInNewTab
  const LinkComponent = isInternal ? Link : 'a'
  const linkProps = isInternal
    ? { href: effectiveHref, className: combinedClassName, style: baseStyle }
    : {
        href: effectiveHref,
        target: effectiveOpenInNewTab ? '_blank' : undefined,
        rel: effectiveOpenInNewTab ? 'noopener noreferrer' : undefined,
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
