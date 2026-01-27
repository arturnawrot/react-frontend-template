import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

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
      name: 'transparentBackground',
      type: 'checkbox',
      label: 'Transparent Background',
      defaultValue: false,
      admin: {
        description: 'When enabled, the section will have a transparent background instead of the default beige color',
      },
    },
    ...createLinkFields({
      linkTextLabel: 'Link Text',
      linkTextRequired: false,
    }),
  ],
}

