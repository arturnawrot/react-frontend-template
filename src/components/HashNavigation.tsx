'use client'

import { useEffect } from 'react'

export function HashNavigation() {
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    if (hash === '#schedule') {
      // Auto-open the Cal.com embedded form
      const openCal = () => {
        const calBtn = document.querySelector<HTMLElement>('[data-cal-link]')
        if (calBtn) {
          calBtn.click()
          return true
        }
        return false
      }
      // Retry until Cal.com script and button are ready
      let attempts = 0
      const interval = setInterval(() => {
        if (openCal() || ++attempts >= 20) clearInterval(interval)
      }, 250)
      return () => clearInterval(interval)
    }

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
