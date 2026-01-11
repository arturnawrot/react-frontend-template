import React from 'react'
import Link from 'next/link'
import styles from './NavbarLink.module.scss'

export function NavbarLink({
  href = '#',
  children,
  className = '',
  isExternal = false,
}: {
  href?: string
  children: React.ReactNode
  className?: string
  isExternal?: boolean
}) {
  // Check if link is external (starts with http:// or https://)
  const isExternalLink = isExternal || (href.startsWith('http://') || href.startsWith('https://'))
  
  const externalProps = isExternalLink
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {}

  // Use regular <a> tag for external links, Next.js Link for internal links
  if (isExternalLink) {
    return (
      <a
        href={href}
        className={`text-white hover:text-opacity-80 transition ${className}`}
        {...externalProps}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className={`text-white hover:text-opacity-80 transition ${className}`}
    >
      {children}
    </Link>
  )
}

export function MainNavbarLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <NavbarLink href={href} className={styles.mainNavbarLink}>
      {children}
    </NavbarLink>
  )
}

export function UpperNavbarLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <NavbarLink href={href} className={styles.upperNavbarLink}>
      {children}
    </NavbarLink>
  )
}

export function CollapsingMenuMobileLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <NavbarLink
      href={href}
      className={`${styles.mainNavbarLink} text-left w-full hover:text-opacity-80 transition px-8`}
    >
      {children}
    </NavbarLink>
  )
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

