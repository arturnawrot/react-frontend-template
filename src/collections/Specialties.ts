import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Specialties: CollectionConfig = {
  slug: 'specialties',
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
        description: 'Specialty name (e.g., "Land", "Retail", "STNL", "Industrial", "Office")',
      },
    },
    slugField({
      fieldToUse: 'name',
    }),
  ],
  timestamps: true,
}




