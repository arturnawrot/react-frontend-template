'use client'

import React from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Check if this is the webpack module resolution error
  // These are known Next.js 15 digests for webpack module resolution errors
  const webpackErrorDigests = ['1160578856', '2185504515']
  const isWebpackError = 
    error.message?.includes("Cannot read properties of undefined (reading 'call')") ||
    (error.digest && webpackErrorDigests.includes(error.digest))

  React.useEffect(() => {
    if (isWebpackError && typeof window !== 'undefined') {
      // This is a known Next.js 15 issue with route groups
      // Reload the page to fix it
      console.warn('Webpack module resolution error detected, reloading page...')
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }, [isWebpackError])

  if (isWebpackError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading...</h2>
        <p>Reloading page to fix module resolution issue...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}

