import type { Block } from 'payload'

export const PropertySearchInput: Block = {
  slug: 'propertySearchInput',
  labels: {
    singular: 'Property Search Input',
    plural: 'Property Search Inputs',
  },
  fields: [
    {
      name: 'forLeaseOnly',
      type: 'checkbox',
      label: 'For Lease Only',
      defaultValue: false,
      admin: {
        description: 'When enabled, limits search to lease properties only and changes heading to "Search Commercial Properties for Lease"',
      },
    },
  ],
}

