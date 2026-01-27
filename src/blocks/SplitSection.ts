import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

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
      name: 'paragraph',
      type: 'textarea',
      required: false,
      label: 'Paragraph Text',
      admin: {
        description: 'Optional paragraph text displayed between the header and bullet points',
      },
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
    ...createLinkFields({
      fieldPrefix: 'button',
      linkTextName: 'buttonText',
      linkTextLabel: 'Button Text',
      linkTextRequired: false,
    }),
    ...createLinkFields(),
  ],
}

