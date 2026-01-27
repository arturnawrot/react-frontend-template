import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Full Width Color', value: 'full-width-color' },
        { label: 'Split', value: 'split' },
        { label: 'Agent', value: 'agent' },
        { label: 'Blog Feature', value: 'blog' },
      ],
      defaultValue: 'default',
      required: true,
    },
    {
      name: 'headingSegments',
      type: 'array',
      label: 'Heading Segments',
      minRows: 1,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            description: 'Hex color code (e.g., #DAE684)',
          },
        },
        {
          name: 'breakOnMobile',
          type: 'checkbox',
          label: 'Break on Mobile',
          defaultValue: false,
        },
        {
          name: 'breakOnDesktop',
          type: 'checkbox',
          label: 'Break on Desktop',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'subheading',
      type: 'textarea',
    },
    // Standard CTAs (Hidden for Blog)
    ...createLinkFields({
      linkTextName: 'ctaPrimaryLabel',
      linkTextLabel: 'Primary CTA Label',
      linkTextRequired: false,
      fieldPrefix: 'ctaPrimary',
    }).map((field) => {
      const existingAdmin = field.admin as any
      const existingCondition = existingAdmin?.condition
      return {
        ...field,
        admin: {
          ...(existingAdmin || {}),
          condition: (data: any, siblingData: any, options?: any) => {
            if (data.variant === 'blog') return false
            if (existingCondition) {
              if (existingCondition.length === 3) {
                return existingCondition(data, siblingData, options)
              }
              return existingCondition(data, siblingData)
            }
            return true
          },
        } as any,
      }
    }),
    ...createLinkFields({
      linkTextName: 'ctaSecondaryLabel',
      linkTextLabel: 'Secondary CTA Label',
      linkTextRequired: false,
      fieldPrefix: 'ctaSecondary',
    }).map((field) => {
      const existingAdmin = field.admin as any
      const existingCondition = existingAdmin?.condition
      return {
        ...field,
        admin: {
          ...(existingAdmin || {}),
          condition: (data: any, siblingData: any, options?: any) => {
            if (data.variant === 'blog') return false
            if (existingCondition) {
              if (existingCondition.length === 3) {
                return existingCondition(data, siblingData, options)
              }
              return existingCondition(data, siblingData)
            }
            return true
          },
        } as any,
      }
    }),
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image (or Featured image for Blog). Used as fallback for video.',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Video',
      admin: {
        description: 'Background video (only used for Default variant). Upload or select a video file (MP4, WebM recommended). The background image will be shown until the video loads or if the browser doesn\'t support video.',
      },
    },
    // Split variant specific fields
    {
      name: 'splitCustomHTML',
      type: 'relationship',
      relationTo: 'custom-html',
      label: 'Custom HTML',
      admin: {
        condition: (data, siblingData) => {
          const variant = data?.variant || siblingData?.variant
          return variant === 'split'
        },
        description: 'Custom HTML to display in the middle of the left column (between subheading and buttons)',
      },
    },
    // Agent variant specific fields
    {
      name: 'agentImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.variant === 'agent',
        description: 'Agent image (for agent variant)',
      },
    },
    {
      name: 'agentEmail',
      type: 'email',
      admin: {
        condition: (data) => data.variant === 'agent',
      },
    },
    {
      name: 'agentPhone',
      type: 'text',
      admin: {
        condition: (data) => data.variant === 'agent',
      },
    },
    {
      name: 'agentLinkedin',
      type: 'text',
      admin: {
        condition: (data) => data.variant === 'agent',
        description: 'LinkedIn profile URL',
      },
    },
    // Blog variant specific fields
    {
      name: 'blogAuthor',
      type: 'relationship',
      relationTo: 'users',
      label: 'Author',
      admin: {
        condition: (data) => data.variant === 'blog',
        description: 'Blog post author',
      },
    },
    {
      name: 'blogDate',
      type: 'date',
      label: 'Creation Date',
      admin: {
        condition: (data) => data.variant === 'blog',
      },
    },
    {
      name: 'blogCategories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      label: 'Categories / Tags',
      admin: {
        condition: (data) => data.variant === 'blog',
        description: 'Blog categories/tags',
      },
    },
  ],
}