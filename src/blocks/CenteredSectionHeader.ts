import type { Block } from 'payload'

export const CenteredSectionHeader: Block = {
  slug: 'centeredSectionHeader',
  labels: {
    singular: 'Centered Section Header',
    plural: 'Centered Section Headers',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
  ],
}
