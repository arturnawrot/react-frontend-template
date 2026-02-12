'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from './PasswordGate.module.css'

interface SiteLockSettings {
  enabled?: boolean | null
  lockScreenTitle?: string | null
  lockScreenMessage?: string | null
  excludedPages?: Array<{ slug: string } | string> | null
}

interface PasswordGateProps {
  children: React.ReactNode
  siteLockSettings: SiteLockSettings | null
  isUnlocked: boolean
}

export function PasswordGate({ children, siteLockSettings, isUnlocked }: PasswordGateProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Check if current path is excluded
  const isPathExcluded = () => {
    if (!siteLockSettings?.enabled) return true

    // Check excluded pages from CMS (relationship to pages collection)
    if (siteLockSettings.excludedPages && Array.isArray(siteLockSettings.excludedPages)) {
      for (const page of siteLockSettings.excludedPages) {
        const slug = typeof page === 'string' ? page : page?.slug
        if (slug) {
          // Match exact slug or if pathname equals /{slug}
          // Also handle home page (slug 'home' matches '/')
          if (pathname === `/${slug}` || (slug === 'home' && pathname === '/')) {
            return true
          }
        }
      }
    }

    return false
  }

  // Handle password submission via secure API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/site-lock/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the page to pick up the new cookie server-side
        router.refresh()
      } else {
        setError(data.error || 'Incorrect password. Please try again.')
        setPassword('')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If lock is not enabled, path is excluded, or already unlocked, show children
  if (!siteLockSettings?.enabled || isPathExcluded() || isUnlocked) {
    return <>{children}</>
  }

  // Show lock screen
  return (
    <div className={styles.lockScreen}>
      <div className={styles.lockContainer}>
        <div className={styles.lockIcon}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className={styles.title}>
          {siteLockSettings.lockScreenTitle || 'This site is password protected'}
        </h1>
        <p className={styles.message}>
          {siteLockSettings.lockScreenMessage || 'Please enter the password to continue.'}
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className={styles.input}
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Verifying...' : 'Unlock'}
          </button>
        </form>
      </div>
      <div className={styles.backgroundPattern} />
    </div>
  )
}
