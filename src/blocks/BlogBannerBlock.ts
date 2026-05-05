import type { Block } from 'payload'
import { createLinkFields } from '../fields/linkField'

export const BlogBannerBlock: Block = {
  slug: 'blogBanner',
  labels: {
    singular: 'Blog Banner',
    plural: 'Blog Banners',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Banner image',
      },
    },
    ...createLinkFields({ includeText: false }),
  ],
}
