import type { Block } from 'payload'

export const StatsSection: Block = {
  slug: 'statsSection',
  labels: {
    singular: 'Stats Section',
    plural: 'Stats Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      required: false,
      admin: {
        description: 'Optional heading above the stats (e.g., "Life at Meybohm")',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Stats Items',
      minRows: 1,
      maxRows: 4,
      required: true,
      fields: [
        {
          name: 'value',
          type: 'text',
          label: 'Value',
          required: true,
          admin: {
            description: 'The main stat value (e.g., "1M+", "80%", "50+")',
          },
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description',
          required: true,
          admin: {
            description: 'Description text below the value',
          },
        },
      ],
      defaultValue: [
        { value: '1M+', description: '1M+ SF under management' },
        { value: '3 Markets', description: '3 markets, 1 unified team' },
        { value: '80%', description: '80% repeat or referral clients' },
        { value: '50+', description: '50+ years of combined advisory experience' },
      ],
    },
  ],
}
