'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'
import type { UIFieldClientComponent } from 'payload'

const TEMPLATE_VARIABLES: Record<string, string[]> = {
  agents: ['firstName', 'lastName', 'fullName', 'displayTitle', 'roles', 'specialties', 'servingLocations', 'email', 'phone'],
  jobs: ['title', 'department', 'location', 'employmentType', 'reportsTo'],
  blogs: ['title', 'description', 'type', 'author', 'categories'],
  properties: ['address', 'city', 'state', 'propertyType', 'buildingSize', 'salePrice'],
}

const EXAMPLES: Record<string, { title: string; description: string }> = {
  agents: {
    title: '{fullName} | Meybohm Real Estate',
    description: '{fullName} - {roles} at Meybohm Real Estate. Specializing in {specialties}.',
  },
  jobs: {
    title: '{title} - {department} | Meybohm Real Estate',
    description: 'Apply for {title} ({employmentType}) in {location}. Join the {department} team at Meybohm Real Estate.',
  },
  blogs: {
    title: '{title} | Meybohm Real Estate',
    description: '{description}',
  },
  properties: {
    title: '{address} | Meybohm Real Estate',
    description: 'Commercial property in {city}, {state} - {buildingSize} | {salePrice}',
  },
}

const TemplateVariablesInfo: UIFieldClientComponent = () => {
  const pageTypeField = useFormFields(([fields]) => fields.pageType)
  const pageType = (pageTypeField?.value as string) || ''
  const vars = TEMPLATE_VARIABLES[pageType]
  const examples = EXAMPLES[pageType]

  if (!vars) return null

  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'var(--theme-elevation-50, #f5f5f5)',
      borderRadius: '4px',
      border: '1px solid var(--theme-elevation-150, #ddd)',
      marginBottom: '16px',
    }}>
      <p style={{ margin: '0 0 8px', fontWeight: 600 }}>
        Available Template Variables
      </p>
      <p style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--theme-elevation-600, #666)' }}>
        Use these in the Title and Description fields. They will be replaced with actual data at runtime.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {vars.map((v) => (
          <code
            key={v}
            style={{
              padding: '2px 8px',
              backgroundColor: 'var(--theme-elevation-100, #e8e8e8)',
              borderRadius: '3px',
              fontSize: '13px',
              fontFamily: 'monospace',
            }}
          >
            {`{${v}}`}
          </code>
        ))}
      </div>
      {examples && (
        <>
          <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 600 }}>Examples:</p>
          <p style={{ margin: '0 0 2px', fontSize: '13px', fontFamily: 'monospace', color: 'var(--theme-elevation-600, #666)' }}>
            Title: {examples.title}
          </p>
          <p style={{ margin: 0, fontSize: '13px', fontFamily: 'monospace', color: 'var(--theme-elevation-600, #666)' }}>
            Description: {examples.description}
          </p>
        </>
      )}
    </div>
  )
}

export default TemplateVariablesInfo
