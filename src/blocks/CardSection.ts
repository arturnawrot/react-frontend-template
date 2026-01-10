import type { Block } from 'payload'

export const CardSection: Block = {
  slug: 'cardSection',
  labels: {
    singular: 'Card Section',
    plural: 'Card Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Relationships Built for the Long Game',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'In every transaction and relationship we hold true to our guiding principles.',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'What Makes Us Different',
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Button Link',
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Card Title',
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          label: 'Icon',
          admin: {
            description: 'FontAwesome icon class (e.g., "fa-regular fa-handshake")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
      ],
    },
  ],
}

