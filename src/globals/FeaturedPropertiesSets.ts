import type { GlobalConfig } from 'payload'

export const FeaturedPropertiesSets: GlobalConfig = {
  slug: 'featuredPropertiesSets',
  admin: {
    description: 'Create and manage sets of featured properties. Each set can contain up to 4 properties and can be assigned to agents.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'json',
      required: false,
      admin: {
        description: 'Sets of featured properties. Managed via the property selector below.',
        hidden: true, // Hidden from form, managed by FeaturedPropertiesSetManager component
      },
    },
    {
      name: 'setManager',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/FeaturedPropertiesSetManager',
        },
      },
    },
  ],
}

