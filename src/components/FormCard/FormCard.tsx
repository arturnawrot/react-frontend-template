import React from 'react'

interface FormCardProps {
  children: React.ReactNode
  className?: string
}

export default function FormCard({ children, className = '' }: FormCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${className}`}
      style={{
        backgroundColor: 'white',
        // background: 'radial-gradient(163.11% 167.11% at 163.11% -52.62%, rgba(195, 195, 195, 0.7) 0%, rgba(249, 248, 246, 0.0121075) 72.23%, rgba(250, 249, 247, 0) 100%)',
        borderRadius: '16px',
        boxShadow: '0px 0px 12px 0px rgba(0, 0, 0, 0.25)',
      }}
    >
      {children}
    </div>
  )
}
