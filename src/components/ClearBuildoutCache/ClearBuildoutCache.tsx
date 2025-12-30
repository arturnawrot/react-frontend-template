'use client'

import React, { useState } from 'react'
import { Button } from '@payloadcms/ui'

function ClearBuildoutCache() {
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleClearCache = async () => {
    setIsClearing(true)
    setMessage(null)

    try {
      const response = await fetch('/api/buildout/clear-cache', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear cache')
      }

      setMessage('Cache cleared successfully!')
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setMessage(`Error: ${errorMessage}`)
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid var(--theme-elevation-100)' }}>
      <div style={{ width: '100%' }}>
        <Button
          onClick={handleClearCache}
          disabled={isClearing}
          buttonStyle="secondary"
          size="small"
        >
          {isClearing ? 'Clearing...' : 'Clear Buildout Cache'}
        </Button>
      </div>
      {message && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '12px',
            color: message.startsWith('Error') 
              ? 'var(--theme-error-500)' 
              : 'var(--theme-success-500)',
            textAlign: 'center',
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default ClearBuildoutCache

