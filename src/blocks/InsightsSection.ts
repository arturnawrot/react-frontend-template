import type { Block } from 'payload'

export const InsightsSection: Block = {
  slug: 'insightsSection',
  labels: {
    singular: 'Insights Section',
    plural: 'Insights Sections',
  },
  fields: [
    {
      name: 'featuredArticleSetName',
      type: 'text',
      label: 'Featured Articles Set',
      admin: {
        description: 'Select a featured articles set from the global sets. Articles from the selected set will be displayed.',
        components: {
          Field: '/components/FeaturedArticleSetSelector/FeaturedArticleSetSelector',
        },
      },
    },
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
  ],
}

