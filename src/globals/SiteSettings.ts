import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'siteSettings',
  admin: {
    description: 'Global site settings including block spacing and layout options',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'blockSpacing',
      type: 'group',
      label: 'Block Spacing',
      admin: {
        description: 'Configure vertical spacing between page blocks',
      },
      fields: [
        {
          name: 'defaultSpacing',
          type: 'select',
          label: 'Default Block Spacing',
          required: true,
          defaultValue: 'medium',
          options: [
            {
              label: 'None',
              value: 'none',
            },
            {
              label: 'Small',
              value: 'small',
            },
            {
              label: 'Medium',
              value: 'medium',
            },
            {
              label: 'Large',
              value: 'large',
            },
            {
              label: 'Extra Large',
              value: 'xlarge',
            },
          ],
          admin: {
            description: 'Default vertical spacing applied between blocks (can be overridden per block)',
          },
        },
      ],
    },
  ],
}
