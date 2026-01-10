import type { Block } from 'payload'

export const FlippedM: Block = {
  slug: 'flippedM',
  labels: {
    singular: 'Flipped M',
    plural: 'Flipped M Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'textarea',
      label: 'Heading',
      admin: {
        description: 'Main heading text (use line breaks for multiple lines)',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
    },
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Bullet Points',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Description',
        },
        {
          name: 'linkText',
          type: 'text',
          required: true,
          label: 'Link Text',
        },
        {
          name: 'linkHref',
          type: 'text',
          required: true,
          label: 'Link URL',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: {
        description: 'Main image displayed on the right side',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: 'CTA Button Link',
    },
  ],
}

