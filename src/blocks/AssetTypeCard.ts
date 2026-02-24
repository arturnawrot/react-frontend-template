import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const AssetTypeCard: Block = {
  slug: 'assetTypeCard',
  labels: {
    singular: 'Asset Type Card',
    plural: 'Asset Type Cards',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      required: false,
      admin: {
        description: 'Optional main heading for the section (uses SectionHeading styling)',
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Background Image',
          admin: {
            description: 'Background image for the card',
          },
        },
        {
          name: 'header',
          type: 'text',
          required: true,
          label: 'Header',
          admin: {
            description: 'Card header text - will be displayed using SectionHeader styling',
          },
        },
        {
          name: 'subheader',
          type: 'textarea',
          label: 'Subheader (Bullets)',
          admin: {
            description: 'Enter each bullet point on a new line. They will be displayed as a bulleted list.',
          },
        },
        ...createLinkFields({
          linkTextName: 'linkText',
          linkTextLabel: 'Link Text',
          linkTextRequired: false,
          fieldPrefix: '',
        }),
      ],
    },
  ],
}
