import type { CollectionConfig } from 'payload'

export const CustomHTML: CollectionConfig = {
  slug: 'custom-html',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'html',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
      },
    },
  ],
  timestamps: true,
}
