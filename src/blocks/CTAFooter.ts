import type { Block } from 'payload'

export const CTAFooter: Block = {
  slug: 'ctaFooter',
  labels: {
    singular: 'CTA Footer',
    plural: 'CTA Footers',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Ready to make your next move?',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      minRows: 1,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Label',
        },
        {
          name: 'href',
          type: 'text',
          label: 'Link URL',
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
          ],
          defaultValue: 'secondary',
        },
      ],
    },
  ],
}

