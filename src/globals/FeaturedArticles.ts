import type { GlobalConfig } from 'payload'

export const FeaturedArticles: GlobalConfig = {
  slug: 'featuredArticles',
  admin: {
    description: 'Create and manage sets of featured articles. Each set can contain multiple blog articles and can be selected in InsightsSection blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Article Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage Featured", "Category Highlights")',
          },
        },
        {
          name: 'articles',
          type: 'relationship',
          relationTo: 'blogs',
          hasMany: true,
          required: false,
          label: 'Articles',
          admin: {
            description: 'Select blog articles to include in this set',
          },
        },
      ],
    },
  ],
}

