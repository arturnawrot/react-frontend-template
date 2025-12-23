import type { Block } from 'payload'

export const InsightsSection: Block = {
  slug: 'insightsSection',
  labels: {
    singular: 'Insights Section',
    plural: 'Insights Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Insights That Shape Smart Investments',
    },
    {
      name: 'linkText',
      type: 'text',
      label: 'Link Text',
      defaultValue: 'Explore More Insights',
    },
    {
      name: 'linkHref',
      type: 'text',
      label: 'Link URL',
      defaultValue: '#',
    },
    {
      name: 'articles',
      type: 'array',
      label: 'Articles',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Image',
        },
        {
          name: 'tags',
          type: 'array',
          label: 'Tags',
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

