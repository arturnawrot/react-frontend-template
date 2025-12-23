import type { Block } from 'payload'

export const TrackRecordSection: Block = {
  slug: 'trackRecordSection',
  labels: {
    singular: 'Track Record Section',
    plural: 'Track Record Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Proven Track Record',
    },
    {
      name: 'properties',
      type: 'array',
      label: 'Properties',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Image',
        },
        {
          name: 'address',
          type: 'text',
          label: 'Address',
        },
        {
          name: 'price',
          type: 'text',
          label: 'Price',
        },
        {
          name: 'size',
          type: 'text',
          label: 'Size',
        },
        {
          name: 'type',
          type: 'text',
          label: 'Type',
        },
        {
          name: 'agentName',
          type: 'text',
          label: 'Agent Name',
        },
        {
          name: 'agentImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Agent Image',
        },
      ],
    },
  ],
}

