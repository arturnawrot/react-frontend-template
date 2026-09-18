import type { Block } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { articleBlocks } from './ArticleBlocks'

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
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: articleBlocks })],
      }),
      admin: {
        description:
          'Rich text content with full formatting support. Use the Blocks menu to insert editorial sections — lead answers, key takeaways, table of contents, comparison tables, pull quotes, callouts, CTAs, FAQs and sources.',
      },
    },
  ],
}
