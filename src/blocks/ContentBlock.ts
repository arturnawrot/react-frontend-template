import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'contentBlock',
  labels: {
    singular: 'Content Block',
    plural: 'Content Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      admin: {
        description: 'Rich text content with full formatting support',
      },
    },
  ],
}
