import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

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
        ...createLinkFields({
          linkTextName: 'label',
          linkTextLabel: 'Label',
          linkTextRequired: true,
        }),
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

