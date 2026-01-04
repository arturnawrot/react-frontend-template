'use client'

import React from 'react'
import { Linkedin, Instagram, Facebook, Mail } from 'lucide-react'

interface ShareButtonsProps {
  url?: string
  title?: string
  description?: string
  showLabel?: boolean
  className?: string
  iconSize?: number
}

export default function ShareButtons({
  url,
  title = '',
  description = '',
  showLabel = true,
  className = '',
  iconSize = 20,
}: ShareButtonsProps) {
  // Get current page URL for sharing
  const [shareUrl, setShareUrl] = React.useState(url || '')
  
  React.useEffect(() => {
    if (!url && typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    } else if (url) {
      setShareUrl(url)
    }
  }, [url])
  
  const shareText = description || `Check out: ${title}`
  const encodedUrl = shareUrl ? encodeURIComponent(shareUrl) : ''
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(shareText)

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && <span className="text-sm font-sans text-gray-600">Share</span>}
      <div className="flex items-center gap-3">
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#1C2F29] transition-colors"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={iconSize} />
        </a>
        <a
          href={`https://www.instagram.com/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#1C2F29] transition-colors"
          aria-label="Share on Instagram"
        >
          <Instagram size={iconSize} />
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-[#1C2F29] transition-colors"
          aria-label="Share on Facebook"
        >
          <Facebook size={iconSize} />
        </a>
        <a
          href={`mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`}
          className="text-gray-600 hover:text-[#1C2F29] transition-colors"
          aria-label="Share via Email"
        >
          <Mail size={iconSize} />
        </a>
      </div>
    </div>
  )
}

