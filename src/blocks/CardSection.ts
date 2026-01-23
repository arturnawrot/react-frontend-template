import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const CardSection: Block = {
  slug: 'cardSection',
  labels: {
    singular: 'Card Section',
    plural: 'Card Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'icons',
      options: [
        {
          label: 'With Icons (3 per row)',
          value: 'icons',
        },
        {
          label: 'With Bullet Points (4 per row)',
          value: 'bulletPoints',
        },
      ],
      admin: {
        description: 'Choose between icon cards (3 per row) or bullet point cards (4 per row)',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
      defaultValue: 'Relationships Built for the Long Game',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'In every transaction and relationship we hold true to our guiding principles.',
    },
    ...createLinkFields({
      linkTextName: 'buttonText',
      linkTextLabel: 'Button Text',
      linkTextRequired: false,
    }),
    {
      name: 'cardTextAlign',
      type: 'select',
      label: 'Card Description Text Align',
      defaultValue: 'left',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
      admin: {
        description: 'Controls the text alignment of card content (icon, title, and description)',
      },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Card Title',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon',
          admin: {
            description: 'FontAwesome icon class (e.g., "fa-regular fa-handshake"). Only used in "icons" variant.',
            condition: (data, siblingData, { blockData }) => {
              return (blockData as any)?.variant !== 'bulletPoints'
            },
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
      ],
    },
  ],
}

