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
    {
      name: 'ctaPrimaryLabel',
      type: 'text',
      label: 'Primary CTA Label',
    },
    {
      name: 'ctaPrimaryLink',
      type: 'text',
      label: 'Primary CTA Link',
    },
    {
      name: 'ctaSecondaryLabel',
      type: 'text',
      label: 'Secondary CTA Label',
    },
    {
      name: 'ctaSecondaryLink',
      type: 'text',
      label: 'Secondary CTA Link',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for hero section',
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
  ],
}

