import type { CollectionConfig } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'author', 'categories', 'createdAt', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Authenticated users can create
    update: ({ req: { user } }) => Boolean(user), // Authenticated users can update
    delete: ({ req: { user } }) => Boolean(user), // Authenticated users can delete
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Article',
          value: 'article',
        },
        {
          label: 'Market Report',
          value: 'market-report',
        },
        {
          label: 'Investment Spotlight',
          value: 'investment-spotlight',
        },
      ],
      defaultValue: 'article',
      admin: {
        description: 'The type of blog post determines its URL structure and related content filtering.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL-friendly slug. Auto-generated from title with type prefix.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short description/subtitle for the blog post (shown in hero)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Featured image displayed in the hero section',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Blog post author',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      required: true,
      admin: {
        description: 'Blog categories/tags',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'Main blog post content',
      },
    },
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'blogs',
      hasMany: true,
      admin: {
        description: 'Manually selected related articles. If empty, articles with the same categories and type will be shown.',
      },
    },
    // Investment Spotlight specific fields
    {
      name: 'propertyType',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'investment-spotlight',
        description: 'Property type (e.g., Medical Office)',
      },
    },
    {
      name: 'size',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'investment-spotlight',
        description: 'Property size (e.g., 18,000 SF (3 Buildings))',
      },
    },
    {
      name: 'market',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'investment-spotlight',
        description: 'Market location (e.g., Columbia, SC)',
      },
    },
    {
      name: 'buyerType',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'investment-spotlight',
        description: 'Buyer type (e.g., 1031 Investor (Out of State))',
      },
    },
    {
      name: 'closeTime',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'investment-spotlight',
        description: 'Close time (e.g., 37 days)',
      },
    },
    {
      name: 'status',
      type: 'text',
      admin: {
        condition: (data) => data.type === 'investment-spotlight',
        description: 'Status (e.g., Closed Off-Market)',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation, originalDoc }) => {
        // Auto-generate slug from title with type prefix
        if (data && data.title) {
          const typePrefix = data.type === 'article' ? 'article' : 
                           data.type === 'market-report' ? 'market-report' : 
                           data.type === 'investment-spotlight' ? 'investment-spotlight' : 'article'
          
          const baseSlug = data.title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          
          // On create, always generate new slug
          if (operation === 'create' || !data.slug) {
            data.slug = `${typePrefix}/${baseSlug}`
          } else {
            // On update, check if type changed or if we need to update prefix
            const currentPrefix = data.slug.includes('/') 
              ? data.slug.split('/')[0]
              : null
            
            // If type changed, update the prefix
            if (currentPrefix !== typePrefix) {
              const slugWithoutPrefix = data.slug.includes('/') 
                ? data.slug.split('/').slice(1).join('/')
                : data.slug
              data.slug = `${typePrefix}/${slugWithoutPrefix}`
            }
            // If title changed significantly, regenerate base slug but keep prefix
            else if (originalDoc && originalDoc.title !== data.title) {
              // Only regenerate if the title changed - extract existing prefix and use new base
              data.slug = `${typePrefix}/${baseSlug}`
            }
          }
        }
        return data
      },
    ],
  },
  timestamps: true,
}

