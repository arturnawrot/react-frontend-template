import type { Block } from 'payload'

export const FeaturedProperties: Block = {
  slug: 'featuredProperties',
  labels: {
    singular: 'Featured Properties',
    plural: 'Featured Properties',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Featured Properties',
    },
    {
      name: 'seeAllLink',
      type: 'text',
      label: 'See All Link',
      defaultValue: '/property-search',
    },
  ],
}

