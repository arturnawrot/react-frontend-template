import type { Block } from 'payload'

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
    {
      name: 'ctaPrimaryLabel',
      type: 'text',
      label: 'Primary CTA Label',
      admin: {
        condition: (data) => data.variant !== 'blog',
      },
    },
    {
      name: 'ctaPrimaryLink',
      type: 'text',
      label: 'Primary CTA Link',
      admin: {
        condition: (data) => data.variant !== 'blog',
      },
    },
    {
      name: 'ctaSecondaryLabel',
      type: 'text',
      label: 'Secondary CTA Label',
      admin: {
        condition: (data) => data.variant !== 'blog',
      },
    },
    {
      name: 'ctaSecondaryLink',
      type: 'text',
      label: 'Secondary CTA Link',
      admin: {
        condition: (data) => data.variant !== 'blog',
      },
    },
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