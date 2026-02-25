'use client'

import { useEffect, useRef } from 'react'

// Module-level singleton — tracks which namespaces have already been initialized
// across all renders so we never double-call Cal("init", ...) or Cal.ns.x("ui", ...)
const initializedNamespaces = new Set<string>()

interface CalUiOptions {
  cssVarsPerTheme?: { light?: Record<string, string>; dark?: Record<string, string> }
  hideEventTypeDetails?: boolean
  layout?: string
  [key: string]: unknown
}

interface CalNamespaceInitProps {
  namespace: string
  uiOptions?: CalUiOptions
}

/**
 * Initializes a Cal.com namespace exactly once (singleton per namespace).
 * Renders nothing — drop it anywhere a cal.com namespace is needed.
 *
 * @example
 * <CalNamespaceInit namespace="consult" uiOptions={{ cssVarsPerTheme: { light: { 'cal-brand': '#3e885b' } } }} />
 * <CalNamespaceInit namespace="tenant" />
 */
export default function CalNamespaceInit({ namespace, uiOptions = {} }: CalNamespaceInitProps) {
  const uiOptionsRef = useRef(uiOptions)

  useEffect(() => {
    if (initializedNamespaces.has(namespace)) return
    initializedNamespaces.add(namespace)

    const cal = (window as any).Cal
    if (!cal) return

    cal('init', namespace, { origin: 'https://app.cal.com' })
    cal.ns[namespace]('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
      ...uiOptionsRef.current,
    })
  }, [namespace])

  return null
}
