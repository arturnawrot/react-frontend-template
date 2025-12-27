import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'categories', 'createdAt', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Authenticated users can create
    update: ({ req: { user } }) => Boolean(user), // Authenticated users can update
    delete: ({ req: { user } }) => Boolean(user), // Authenticated users can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({
      fieldToUse: 'title',
    }),
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
        description: 'Manually selected related articles. If empty, articles with the same categories will be shown.',
      },
    },
  ],
  timestamps: true,
}

