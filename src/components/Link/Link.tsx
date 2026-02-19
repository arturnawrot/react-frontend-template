import React from 'react'
import NextLink from 'next/link'
import { isInternalLink } from '@/utils/link-utils'

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  children: React.ReactNode
  openInNewTab?: boolean
  disabled?: boolean
}

/**
 * Universal Link component that automatically uses Next.js Link for internal links
 * and regular <a> tag for external links, mailto:, tel:, etc.
 * When disabled, renders as a span with the same styling but non-clickable.
 */
export default function Link({ 
  href, 
  children, 
  className,
  openInNewTab,
  disabled,
  ...props 
}: LinkProps) {
  // If disabled, render as a span (non-clickable)
  if (disabled) {
    return (
      <span className={className} aria-disabled="true" {...props}>
        {children}
      </span>
    )
  }

  // Force external if openInNewTab is explicitly set
  const isInternal = isInternalLink(href) && !openInNewTab

  if (isInternal) {
    return (
      <NextLink href={href} className={className} {...props}>
        {children}
      </NextLink>
    )
  }

  // External link - use regular <a> tag
  const externalProps = {
    href,
    className,
    target: openInNewTab || href.startsWith('http') ? '_blank' : undefined,
    rel: (openInNewTab || href.startsWith('http')) ? 'noopener noreferrer' : undefined,
    ...props,
  }

  return <a {...externalProps}>{children}</a>
}
