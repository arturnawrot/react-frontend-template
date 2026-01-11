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
      type: 'array',
      label: 'Property Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage Featured", "Default Set")',
          },
        },
        {
          name: 'propertyIds',
          type: 'json',
          required: false,
          label: 'Property IDs',
          admin: {
            description: 'Buildout property IDs (max 4 allowed). Enter as JSON array of numbers, e.g., [123, 456, 789]',
          },
        },
      ],
    },
  ],
}

