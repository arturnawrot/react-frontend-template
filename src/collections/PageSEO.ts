import type { CollectionConfig } from 'payload'

export const PageSEO: CollectionConfig = {
  slug: 'page-seo',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'title', 'updatedAt'],
    group: 'Settings',
    description: 'SEO metadata for hard-coded pages (routes not managed in the Pages collection)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        placeholder: '/about or /agents',
        description: 'The URL path (e.g., /about, /contact, /agents)',
      },
      validate: (value: string | null | undefined) => {
        if (!value?.startsWith('/')) {
          return 'Path must start with /'
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title for search engines and browser tabs',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Meta description for search engines (recommended: 150-160 characters)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Image for social media sharing (Open Graph)',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Prevent search engines from indexing this page',
      },
    },
  ],
}
