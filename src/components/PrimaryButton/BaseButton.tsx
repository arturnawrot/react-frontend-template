import React from 'react'
import Link from 'next/link'
import type { ResolvedLink } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'

interface BaseButtonProps {
  children: React.ReactNode
  link?: ResolvedLink       // CMS-resolved link — overrides individual link props
  href?: string | null      // Static href for non-CMS use
  onClick?: () => void
  openInNewTab?: boolean
  className?: string
  fullWidth?: boolean
  disabled?: boolean
  calLink?: string | null
  calNamespace?: string | null
}

export default function BaseButton({
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
}: BaseButtonProps) {
  const effectiveHref = link?.href ?? href
  const effectiveOpenInNewTab = link?.openInNewTab ?? openInNewTab
  const effectiveDisabled = link?.disabled ?? disabled
  const effectiveCalLink = link?.calLink ?? calLink
  const effectiveCalNamespace = link?.calNamespace ?? calNamespace

  const fullWidthClass = fullWidth ? 'w-full md:w-auto' : ''
  const disabledClass = effectiveDisabled ? 'opacity-50 cursor-not-allowed' : ''
  const baseClassName = `${className} ${fullWidthClass} ${disabledClass}`.trim()

  if (effectiveCalLink) {
    return (
      <button
        className={`${baseClassName} cursor-pointer`}
        type="button"
        data-cal-link={effectiveCalLink}
        data-cal-namespace={effectiveCalNamespace ?? undefined}
        data-cal-config='{"layout":"month_view"}'
      >
        {children}
      </button>
    )
  }

  if (effectiveHref) {
    if (effectiveDisabled) {
      return (
        <span className={baseClassName} aria-disabled="true">
          {children}
        </span>
      )
    }

    const isInternal = isInternalLink(effectiveHref) && !effectiveOpenInNewTab
    const LinkComponent = isInternal ? Link : 'a'
    const linkProps = isInternal
      ? { href: effectiveHref, className: baseClassName }
      : {
          href: effectiveHref,
          target: effectiveOpenInNewTab ? '_blank' : undefined,
          rel: effectiveOpenInNewTab ? 'noopener noreferrer' : undefined,
          className: baseClassName,
        }
    return <LinkComponent {...linkProps}>{children}</LinkComponent>
  }

  return (
    <button onClick={onClick} className={baseClassName} type="button" disabled={effectiveDisabled}>
      {children}
    </button>
  )
}
