import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    description: 'Configure the footer links, contact information, and social media',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'navigationColumns',
      type: 'array',
      label: 'Navigation Columns',
      admin: {
        description: 'Link columns shown in the footer (e.g., Buy/Lease/Sell, Our Agents, etc.)',
      },
      fields: [
        {
          name: 'links',
          type: 'array',
          label: 'Links',
          required: true,
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
      ],
    },
    {
      name: 'offices',
      type: 'array',
      label: 'Office Locations',
      admin: {
        description: 'Office contact information',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Office Label',
          admin: {
            description: 'Optional label for the office (e.g., "Augusta Office", "Aiken Office")',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          label: 'Address',
          required: true,
          admin: {
            description: 'Street address (each line will be displayed separately)',
          },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'fax',
          type: 'text',
          label: 'Fax Number',
        },
        {
          name: 'tollFree',
          type: 'text',
          label: 'Toll Free Number',
        },
      ],
    },
    {
      name: 'socialMedia',
      type: 'group',
      label: 'Social Media Links',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook URL',
          admin: {
            description: 'Leave empty to hide Facebook icon',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn URL',
          admin: {
            description: 'Leave empty to hide LinkedIn icon',
          },
        },
      ],
    },
    {
      name: 'bottomBar',
      type: 'group',
      label: 'Bottom Bar',
      fields: [
        {
          name: 'copyrightText',
          type: 'text',
          label: 'Copyright Text',
          defaultValue: '© 2025 Real Estate Co. All rights reserved.',
          admin: {
            description: 'Copyright notice displayed in the bottom bar',
          },
        },
        {
          name: 'policyLinks',
          type: 'array',
          label: 'Policy Links',
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
              },
            },
          ],
        },
      ],
    },
  ],
}

