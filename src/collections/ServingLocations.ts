import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const ServingLocations: CollectionConfig = {
  slug: 'serving-locations',
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
        description: 'Location name (e.g., "Augusta", "Savannah", "Statesboro")',
      },
    },
    slugField({
      fieldToUse: 'name',
    }),
  ],
  timestamps: true,
}



