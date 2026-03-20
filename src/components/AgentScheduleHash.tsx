'use client'

import { useEffect } from 'react'

interface AgentScheduleHashProps {
  calLink: string
  calNamespace?: string | null
}

/**
 * Opens the agent's Cal.com embedded form when #schedule is in the URL.
 * Receives calLink/calNamespace from the agent's Payload record
 * (the same data the "Schedule A Consultation" button uses).
 */
export function AgentScheduleHash({ calLink, calNamespace }: AgentScheduleHashProps) {
  useEffect(() => {
    if (window.location.hash !== '#schedule') return

    const openCal = () => {
      const cal = (window as any).Cal
      if (!cal) return false

      if (calNamespace) {
        // Initialize the namespace if not already done
        cal('init', calNamespace, { origin: 'https://app.cal.com' })
        cal.ns[calNamespace]('modal', { calLink })
      } else {
        cal('modal', { calLink })
      }
      return true
    }

    // Retry until Cal.com script is ready
    let attempts = 0
    const interval = setInterval(() => {
      if (openCal() || ++attempts >= 20) clearInterval(interval)
    }, 250)
    return () => clearInterval(interval)
  }, [calLink, calNamespace])

  return null
}
