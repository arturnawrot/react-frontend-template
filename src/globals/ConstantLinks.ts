import type { GlobalConfig } from 'payload'

export const ConstantLinks: GlobalConfig = {
  slug: 'constantLinks',
  admin: {
    description: 'Manage constant links that can be used across blocks. These links can be updated in one place and will automatically update everywhere they are used.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      label: 'Constant Links',
      minRows: 0,
      admin: {
        description: 'Define constant links that can be referenced by blocks. When you update a link here, it will automatically update everywhere it is used.',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          label: 'Key',
          required: true,
          unique: true,
          admin: {
            description: 'Unique identifier for this constant link (e.g., "contact", "about", "apply-now")',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            description: 'Display name for this constant link (e.g., "Contact Us", "About Us", "Apply Now")',
          },
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
          admin: {
            description: 'The URL this constant link redirects to (e.g., /contact, https://example.com, /about)',
          },
        },
      ],
    },
  ],
}
