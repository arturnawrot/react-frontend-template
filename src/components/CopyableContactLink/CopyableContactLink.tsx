'use client'

import { useState, type ReactNode } from 'react'
import { Mail, Phone, Check } from 'lucide-react'

type ContactType = 'email' | 'phone'

interface CopyableContactLinkProps {
  type: ContactType
  value: string
  className?: string
  iconClassName?: string
  label?: string
  /** Tooltip background color class, defaults to dark */
  tooltipBgClass?: string
  /** Tooltip text color class, defaults to white */
  tooltipTextClass?: string
}

export default function CopyableContactLink({
  type,
  value,
  className = '',
  iconClassName = 'w-4 h-4',
  label,
  tooltipBgClass = 'bg-[#1a2e2a]',
  tooltipTextClass = 'text-white',
}: CopyableContactLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const href = type === 'email' ? `mailto:${value}` : `tel:${value}`
  const Icon = type === 'email' ? Mail : Phone
  const displayLabel = label ?? (type === 'email' ? 'Email' : 'Phone')

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`relative ${className}`}
    >
      <Icon className={iconClassName} /> {displayLabel}
      {copied && (
        <span 
          className={`absolute -top-8 left-1/2 -translate-x-1/2 ${tooltipBgClass} ${tooltipTextClass} text-xs px-2 py-1 rounded whitespace-nowrap flex items-center gap-1 z-50`}
        >
          <Check className="w-3 h-3" /> Copied!
        </span>
      )}
    </a>
  )
}
