import type { CollectionConfig } from 'payload'
import { slugify } from '../utils/slugify'

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
        description: 'URL-friendly slug. Auto-generated from title.',
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
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Full URL to the blog post (read-only, auto-generated)',
      },
      access: {
        update: () => false, // Prevent updates
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData, req }) => {
            // Compute URL from type and slug
            const type = siblingData?.type || data?.type
            const slug = siblingData?.slug || data?.slug
            
            if (!type || !slug) {
              return ''
            }
            
            // Get domain from request headers or environment variables
            let domain = process.env.NEXT_PUBLIC_SITE_URL
            
            if (!domain && req?.headers) {
              const host = req.headers.get('host') || req.headers.get('x-forwarded-host')
              const protocol = req.headers.get('x-forwarded-proto') || (req.headers.get('host')?.includes('localhost') ? 'http' : 'https')
              if (host) {
                domain = `${protocol}://${host}`
              }
            }
            
            if (!domain && process.env.VERCEL_URL) {
              domain = `https://${process.env.VERCEL_URL}`
            }
            
            // Map type to URL path
            const typePathMap: Record<string, string> = {
              'article': 'article',
              'market-report': 'market-report',
              'investment-spotlight': 'investment-spotlight',
            }
            
            const path = typePathMap[type] || 'article'
            return domain ? `${domain}/${path}/${slug}` : `/${path}/${slug}`
          },
        ],
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title using slugify utility
        if (data && data.title) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
    afterRead: [
      ({ doc, req }) => {
        // Compute and add URL to the document
        if (doc.type && doc.slug) {
          // Get domain from request headers or environment variables
          let domain = process.env.NEXT_PUBLIC_SITE_URL
          
          if (!domain && req?.headers) {
            const host = req.headers.get('host') || req.headers.get('x-forwarded-host')
            const protocol = req.headers.get('x-forwarded-proto') || (req.headers.get('host')?.includes('localhost') ? 'http' : 'https')
            if (host) {
              domain = `${protocol}://${host}`
            }
          }
          
          if (!domain && process.env.VERCEL_URL) {
            domain = `https://${process.env.VERCEL_URL}`
          }
          
          // Map type to URL path
          const typePathMap: Record<string, string> = {
            'article': 'article',
            'market-report': 'market-report',
            'investment-spotlight': 'investment-spotlight',
          }
          
          const path = typePathMap[doc.type] || 'article'
          doc.url = domain ? `${domain}/${path}/${doc.slug}` : `/${path}/${doc.slug}`
        }
        return doc
      },
    ],
  },
  timestamps: true,
}

