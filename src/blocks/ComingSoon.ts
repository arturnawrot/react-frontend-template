import type { Block } from 'payload'

export const ComingSoon: Block = {
  slug: 'comingSoon',
  labels: {
    singular: 'Coming Soon',
    plural: 'Coming Soon Pages',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'Coming Soon:',
      admin: {
        description: 'Main heading text (e.g., "Coming Soon:")',
      },
    },
    {
      name: 'headingLine2',
      type: 'text',
      required: true,
      defaultValue: 'A New Meybohm Commercial',
      admin: {
        description: 'Second line of heading',
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      required: true,
      defaultValue: "We're entering a new chapter, grounded in trusted guidance and long-term relationships.",
      admin: {
        description: 'Subheading text below the main heading',
      },
    },
    {
      name: 'formHeader',
      type: 'text',
      required: true,
      defaultValue: 'Be the first to know when we go live.',
      admin: {
        description: 'Text above the email signup form',
      },
    },
    {
      name: 'formPlaceholder',
      type: 'text',
      defaultValue: 'Enter your email',
      admin: {
        description: 'Placeholder text for the email input',
      },
    },
    {
      name: 'formButtonText',
      type: 'text',
      defaultValue: 'Notify Me',
      admin: {
        description: 'Text for the submit button',
      },
    },
    {
      name: 'offices',
      type: 'array',
      label: 'Office Locations',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
          admin: {
            description: 'City name (e.g., "Augusta")',
          },
        },
        {
          name: 'address',
          type: 'text',
          required: true,
          admin: {
            description: 'Full street address',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Phone number',
          },
        },
      ],
      defaultValue: [
        {
          city: 'Augusta',
          address: '3519 Wheeler Road, Augusta, GA 30909',
          phone: '706-736-0700 Office',
        },
        {
          city: 'Aiken',
          address: '142 Laurens Street NW, Aiken, SC 29801',
          phone: '803-644-1770',
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      defaultValue: '© 2025 Meybohm. All rights reserved.',
      admin: {
        description: 'Copyright text at the bottom',
      },
    },
  ],
}
