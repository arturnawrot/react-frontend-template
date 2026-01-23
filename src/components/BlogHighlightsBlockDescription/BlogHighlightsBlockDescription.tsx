import React from 'react'
import Link from 'next/link'

export default function BlogHighlightsBlockDescription() {
  return (
    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
      Renders the Blog Highlights section configured in the{' '}
      <Link
        href="/admin/globals/blogHighlights"
        style={{ color: '#3b82f6', textDecoration: 'underline' }}
      >
        Blog Highlights Global
      </Link>
      . Includes featured posts, category explorer, and custom sections.
    </div>
  )
}
