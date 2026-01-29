'use client'

import React, { useEffect, useRef } from 'react'

type CustomHtmlProps = {
  html: string
  className?: string
}

/**
 * Reusable component for rendering raw HTML with Script Support.
 * 
 * FEATURES:
 * 1. Hydration Mismatch Fix: Manually injects HTML via useEffect.
 * 2. Script Execution: Re-creates script tags to force execution on route changes.
 * 3. Iframe Resizer Safety Net: Manually listens for postMessage height events 
 *    (specifically for HighLevel/LeadConnector forms) to ensure the iframe 
 *    resizes correctly even if the external script fails to re-initialize.
 */
export const CustomHtml = ({ html, className }: CustomHtmlProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!html || !containerRef.current) return

    const container = containerRef.current
    
    // 1. Inject HTML manually to avoid React Hydration mismatches
    container.innerHTML = html

    // 2. Setup Manual Iframe Resizer (Safety Net)
    // HighLevel/LeadConnector forms use postMessage to signal their height.
    const iframe = container.querySelector('iframe')
    
    const handleResizeMessage = (event: MessageEvent) => {
      // If we can't find our iframe, stop
      if (!iframe) return

      let data = event.data

      // Parse JSON if data is a string (common in some older widgets)
      try {
        if (typeof data === 'string') {
          data = JSON.parse(data)
        }
      } catch (e) {
        // Ignore non-JSON string messages
        return
      }

      // Check if this message is for our iframe
      // HighLevel forms usually send: { id: "iframe-id", height: 1234 }
      const isMatchingId = data?.id && data.id === iframe.id
      const isMatchingWindow = event.source === iframe.contentWindow

      if ((isMatchingId || isMatchingWindow) && data?.height) {
        iframe.style.height = `${data.height}px`
        
        // Also fix the parent container height if needed (optional, helps preventing scrollbars)
        iframe.style.minHeight = '100%'
      }
    }

    if (iframe) {
      window.addEventListener('message', handleResizeMessage)
    }

    // 3. Re-execute Scripts
    // We remove the old scripts and create new ones to force the browser to execute them again.
    let isMounted = true
    const scripts = Array.from(container.querySelectorAll('script'))

    scripts.forEach((script) => {
      if (!isMounted) return

      const newScript = document.createElement('script')
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value)
      })

      if (script.src) {
        newScript.src = script.src 
      } else {
        newScript.innerHTML = script.innerHTML
      }
      
      script.parentNode?.replaceChild(newScript, script)
    })

    return () => {
      isMounted = false
      if (iframe) {
        window.removeEventListener('message', handleResizeMessage)
      }
      // Cleanup content on unmount to prevent ID conflicts
      container.innerHTML = ''
    }
  }, [html])

  return (
    <div
      ref={containerRef}
      className={className}
    />
  )
}

export default CustomHtml