import type { Block } from 'payload'

export const FeaturedProperties: Block = {
  slug: 'featuredProperties',
  labels: {
    singular: 'Featured Properties',
    plural: 'Featured Properties',
  },
  fields: [
    {
      name: 'featuredPropertySetName',
      type: 'text',
      label: 'Featured Properties Set',
      admin: {
        description: 'Select a featured properties set from the global sets. Leave empty to show no properties.',
        components: {
          Field: '/components/FeaturedPropertySetSelector/FeaturedPropertySetSelector',
        },
      },
    },
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

