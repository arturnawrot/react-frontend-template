import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

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
        // Image moved here for scroll-jacking
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
          admin: {
            description: 'Image displayed when this section is active',
          },
        },
        ...createLinkFields({
          linkTextRequired: false,
        }),
      ],
    },
    // Top-level image removed
    ...createLinkFields({
      linkTextName: 'ctaText',
      linkTextLabel: 'CTA Button Text',
      linkTextRequired: false,
    }),
  ],
}