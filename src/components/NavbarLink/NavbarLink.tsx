import React from 'react'
import Link from 'next/link'
import type { ResolvedLink } from '@/utils/linkResolver'
import styles from './NavbarLink.module.scss'
import CalNamespaceInit from '@/components/CalNamespaceInit'

interface NavbarLinkProps {
  link: ResolvedLink
  children: React.ReactNode
  className?: string
}

/**
 * Single source of truth for rendering any CMS-managed link.
 * Handles all link types based on ResolvedLink fields.
 * To add a new link type: update ResolvedLink + add a branch here. Nothing else changes.
 */
export function NavbarLink({ link, children, className = '' }: NavbarLinkProps) {
  if (link.calLink) {
    return (
      <>
        {link.calNamespace && <CalNamespaceInit namespace={link.calNamespace} />}
        <button
          type="button"
          className={`${className} cursor-pointer`}
          data-cal-link={link.calLink}
          data-cal-namespace={link.calNamespace ?? undefined}
          data-cal-config='{"layout":"month_view"}'
        >
          {children}
        </button>
      </>
    )
  }

  if (!link.href) {
    return <span className={className}>{children}</span>
  }

  const isExternal = link.href.startsWith('http://') || link.href.startsWith('https://')

  if (isExternal || link.openInNewTab) {
    return (
      <a href={link.href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return <Link href={link.href} className={className}>{children}</Link>
}

export function MainNavbarLink({ link, children }: { link: ResolvedLink; children: React.ReactNode }) {
  return <NavbarLink link={link} className={styles.mainNavbarLink}>{children}</NavbarLink>
}

export function UpperNavbarLink({ link, children }: { link: ResolvedLink; children: React.ReactNode }) {
  return <NavbarLink link={link} className={styles.upperNavbarLink}>{children}</NavbarLink>
}

export function CollapsingMenuMobileLink({ link, children }: { link: ResolvedLink; children: React.ReactNode }) {
  return <NavbarLink link={link} className={styles.collapsingMenuMobileLink}>{children}</NavbarLink>
}

export const MAIN_LINKS = [
  { label: 'Buy', href: '/buy' },
  { label: 'Lease', href: '/lease' },
  { label: 'Sell', href: '/sell' },
  { label: 'Our Agents', href: '/agents' },
  { label: 'Our Advantages', href: '/advantages' },
  { label: 'Our Services', href: '/services' },
  { label: 'Insights & Research', href: '/insights' },
]

export const UPPER_LINKS = [
  { label: 'Schedule', href: '/schedule' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Login', href: '/login' },
]

export const ALL_LINKS = [...MAIN_LINKS, ...UPPER_LINKS]
