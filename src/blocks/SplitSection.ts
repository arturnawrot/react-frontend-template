import type { Block } from 'payload'

export const SplitSection: Block = {
  slug: 'splitSection',
  labels: {
    singular: 'Split Section',
    plural: 'Split Sections',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Image',
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Image Alt Text',
      defaultValue: 'Section image',
    },
    {
      name: 'isReversed',
      type: 'checkbox',
      label: 'Reverse Layout',
      defaultValue: false,
      admin: {
        description: 'Show image on the right side',
      },
    },
    {
      name: 'header',
      type: 'text',
      required: true,
      label: 'Header',
    },
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Bullet Points',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Text',
        },
      ],
    },
    {
      name: 'linkText',
      type: 'text',
      label: 'Link Text',
    },
    {
      name: 'linkHref',
      type: 'text',
      label: 'Link URL',
    },
  ],
}

