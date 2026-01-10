import type { GlobalConfig } from 'payload'

export const ProvenTrackRecordSets: GlobalConfig = {
  slug: 'provenTrackRecordSets',
  admin: {
    description: 'Create and manage sets of proven track record items. Each set can be used in Track Record Section blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Sets',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name to identify this set (e.g., "Commercial Properties", "Residential Sales")',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Items',
          minRows: 1,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Picture',
            },
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Title',
            },
            {
              name: 'address',
              type: 'text',
              required: false,
              label: 'Address',
            },
            {
              name: 'price',
              type: 'text',
              required: false,
              label: 'Price',
              admin: {
                description: 'Price display (e.g., "$700,000")',
              },
            },
            {
              name: 'size',
              type: 'text',
              required: false,
              label: 'Size',
              admin: {
                description: 'Property size (e.g., "4,961 SF")',
              },
            },
            {
              name: 'propertyType',
              type: 'text',
              required: false,
              label: 'Property Type',
              admin: {
                description: 'Property type (e.g., "Office Space", "Retail")',
              },
            },
            {
              name: 'agent',
              type: 'relationship',
              relationTo: 'agents',
              required: false,
              label: 'Agent',
              admin: {
                description: 'Select an agent from existing agents',
              },
            },
            {
              name: 'link',
              type: 'text',
              required: false,
              label: 'Link',
              admin: {
                description: 'URL for redirect on click (e.g., "/property/123" or "https://example.com")',
              },
            },
          ],
        },
      ],
    },
  ],
}
