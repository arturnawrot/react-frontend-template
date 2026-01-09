import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Role name (e.g., "Buyer Rep", "Tenant Rep", "Dispositions", "Agent & Broker")',
      },
    },
    slugField({
      fieldToUse: 'name',
    }),
  ],
  timestamps: true,
}


