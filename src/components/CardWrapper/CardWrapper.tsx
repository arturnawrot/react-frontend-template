import React from 'react'
import styles from './CardWrapper.module.scss'

interface CardWrapperProps {
  children: React.ReactNode
  className?: string
}

export default function CardWrapper({ children, className = '' }: CardWrapperProps) {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  )
}
