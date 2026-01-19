import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  admin: {
    description: 'Search engine optimization settings',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Meta Title',
      admin: {
        description: 'Title for search engines and browser tabs. Recommended: 50-60 characters.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta Description',
      admin: {
        description: 'Description for search engines. Recommended: 150-160 characters.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Social Image',
      admin: {
        description: 'Image for social media sharing (Open Graph / Twitter). Recommended: 1200x630px.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Hide from search engines',
      defaultValue: false,
      admin: {
        description: 'Prevent this page from being indexed by search engines.',
      },
    },
  ],
}
