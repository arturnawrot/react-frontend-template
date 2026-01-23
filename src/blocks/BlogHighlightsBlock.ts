import type { Block } from 'payload'

export const BlogHighlightsBlock: Block = {
  slug: 'blogHighlightsBlock',
  labels: {
    singular: 'Blog Highlights',
    plural: 'Blog Highlights',
  },
  fields: [
    {
      name: 'description',
      type: 'ui',
      admin: {
        components: {
          Field:
            '/components/BlogHighlightsBlockDescription/BlogHighlightsBlockDescription',
        },
      },
    },
  ],
}
