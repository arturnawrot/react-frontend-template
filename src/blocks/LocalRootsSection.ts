import type { Block } from 'payload'

export const LocalRootsSection: Block = {
  slug: 'localRootsSection',
  labels: {
    singular: 'Local Roots Section',
    plural: 'Local Roots Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Color Variant',
      defaultValue: 'dark',
      options: [
        { label: 'Dark (Black text)', value: 'dark' },
        { label: 'Light (White text)', value: 'light' },
      ],
      admin: {
        description: 'Choose color scheme - dark for black text, light for white text',
      },
    },
    {
      name: 'useCardStyle',
      type: 'checkbox',
      label: 'Use Card Style',
      defaultValue: false,
      admin: {
        description: 'When enabled, displays content in a card with white background, border and shadow (like CardSection)',
      },
    },
    {
      name: 'headingAlignment',
      type: 'select',
      label: 'Heading Vertical Alignment',
      defaultValue: 'top',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
      ],
      admin: {
        description: 'Vertical alignment of the heading relative to the items list',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: true,
      defaultValue: 'Local Roots with a National Reach',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'sentence',
          type: 'text',
          label: 'Sentence',
          required: true,
        },
      ],
      defaultValue: [
        { sentence: 'Southeast-based, regionally respected' },
        { sentence: 'Market presence in Augusta, Aiken, Columbia - with national reach' },
        { sentence: 'Deep repeat client base. "We measure success in return calls, not cold calls."' },
        { sentence: 'Integrated platform. Listings, advisory, planning, marketing, and management' },
      ],
    },
  ],
}
