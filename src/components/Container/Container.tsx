import React from 'react'
import { CONTAINER_MAX_WIDTH_CLASS, CONTAINER_PADDING_X } from '@/utils/constants'

type ContainerProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Universal Container component that applies standard max-width and padding
 * Used to wrap content sections for consistent layout across the site
 */
export default function Container({ children, className }: ContainerProps) {
  const baseClasses = `${CONTAINER_MAX_WIDTH_CLASS} ${CONTAINER_PADDING_X} mx-auto`
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses

  return <div className={combinedClasses}>{children}</div>
}
