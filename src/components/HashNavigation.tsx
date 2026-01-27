'use client'

import { useEffect } from 'react'

export function HashNavigation() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      const anchor = document.getElementById(hash.slice(1))
      if (!anchor) return
      anchor.scrollIntoView({ behavior: 'smooth' })
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return null
}
