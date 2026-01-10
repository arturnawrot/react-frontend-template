import React from 'react'
import type { Page } from '@/payload-types'
import PropertySearch from './PropertySearch'

type PropertySearchBlock = Extract<Page['blocks'][number], { blockType: 'propertySearch' }>

interface PropertySearchWrapperProps {
  block: PropertySearchBlock
}

/**
 * Simple wrapper for PropertySearch component.
 * PropertySearch now handles all data fetching client-side in chunks.
 */
export default function PropertySearchWrapper({ block }: PropertySearchWrapperProps) {
  return <PropertySearch block={block} />
}

