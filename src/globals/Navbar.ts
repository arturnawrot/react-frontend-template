import type { GlobalConfig } from 'payload'

export const Navbar: GlobalConfig = {
  slug: 'navbar',
  admin: {
    description: 'Configure the navigation bar links',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'upperLinks',
      type: 'array',
      label: 'Upper Navigation Links',
      admin: {
        description: 'Links shown in the top bar (e.g., Schedule, Contact Us, Login)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'linkType',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Page',
              value: 'page',
            },
            {
              label: 'Custom URL',
              value: 'custom',
            },
          ],
          admin: {
            description: 'Choose whether to link to an existing page or a custom URL',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            condition: (data, siblingData) => {
              const linkType = siblingData?.linkType
              return linkType === 'page'
            },
            description: 'Select a page to link to',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => {
              const linkType = siblingData?.linkType
              return linkType === 'custom'
            },
            description: 'Enter a custom URL (e.g., /contact, https://example.com)',
          },
        },
      ],
    },
    {
      name: 'mainLinks',
      type: 'array',
      label: 'Main Navigation Links',
      admin: {
        description: 'Links shown in the main navigation bar (e.g., Buy, Lease, Sell)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'linkType',
          type: 'select',
          required: true,
          options: [
            {
              label: 'Page',
              value: 'page',
            },
            {
              label: 'Custom URL',
              value: 'custom',
            },
          ],
          admin: {
            description: 'Choose whether to link to an existing page or a custom URL',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          admin: {
            condition: (data, siblingData) => {
              const linkType = siblingData?.linkType
              return linkType === 'page'
            },
            description: 'Select a page to link to',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          required: true,
          admin: {
            condition: (data, siblingData) => {
              const linkType = siblingData?.linkType
              return linkType === 'custom'
            },
            description: 'Enter a custom URL (e.g., /buy, https://example.com)',
          },
        },
      ],
    },
  ],
}

