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
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          admin: {
            description: 'Main text for the item',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: false,
          admin: {
            description: 'Optional secondary text/description',
          },
        },
      ],
      defaultValue: [
        { title: 'Southeast-based, regionally respected' },
        { title: 'Market presence in Augusta, Aiken, Columbia - with national reach' },
        { title: 'Deep repeat client base.', description: '"We measure success in return calls, not cold calls."' },
        { title: 'Integrated platform.', description: 'Listings, advisory, planning, marketing, and management' },
      ],
    },
  ],
}
