import type { GlobalConfig } from 'payload'

// Reusable link fields for columns
const columnLinkFields = [
  {
    name: 'label',
    type: 'text' as const,
    required: true,
  },
  {
    name: 'linkType',
    type: 'select' as const,
    required: true,
    defaultValue: 'custom',
    options: [
      { label: 'Page', value: 'page' },
      { label: 'Custom URL', value: 'custom' },
    ],
  },
  {
    name: 'page',
    type: 'relationship' as const,
    relationTo: 'pages' as const,
    admin: {
      condition: (_data: unknown, siblingData: { linkType?: string }) => siblingData?.linkType === 'page',
    },
  },
  {
    name: 'customUrl',
    type: 'text' as const,
    admin: {
      condition: (_data: unknown, siblingData: { linkType?: string }) => siblingData?.linkType === 'custom',
      description: 'Enter a custom URL (e.g., /services, https://example.com)',
    },
  },
]

// Dropdown column fields (reused for both upper and main links)
const dropdownColumnFields = [
  {
    name: 'columnName',
    type: 'text' as const,
    required: true,
    label: 'Column Title',
    admin: {
      description: 'e.g., "Needs", "Property Types", "Frequently Used Links"',
    },
  },
  {
    name: 'links',
    type: 'array' as const,
    label: 'Column Links',
    fields: columnLinkFields,
  },
  {
    name: 'bottomLink',
    type: 'group' as const,
    label: 'Bottom Link (Optional)',
    admin: {
      description: 'Optional "See All..." link at the bottom of the column',
    },
    fields: [
      {
        name: 'enabled',
        type: 'checkbox' as const,
        label: 'Show Bottom Link',
        defaultValue: false,
      },
      {
        name: 'label',
        type: 'text' as const,
        admin: {
          condition: (_data: unknown, siblingData: { enabled?: boolean }) => siblingData?.enabled === true,
          description: 'e.g., "See All Property Types"',
        },
      },
      {
        name: 'linkType',
        type: 'select' as const,
        defaultValue: 'custom',
        options: [
          { label: 'Page', value: 'page' },
          { label: 'Custom URL', value: 'custom' },
        ],
        admin: {
          condition: (_data: unknown, siblingData: { enabled?: boolean }) => siblingData?.enabled === true,
        },
      },
      {
        name: 'page',
        type: 'relationship' as const,
        relationTo: 'pages' as const,
        admin: {
          condition: (_data: unknown, siblingData: { enabled?: boolean; linkType?: string }) =>
            siblingData?.enabled === true && siblingData?.linkType === 'page',
        },
      },
      {
        name: 'customUrl',
        type: 'text' as const,
        admin: {
          condition: (_data: unknown, siblingData: { enabled?: boolean; linkType?: string }) =>
            siblingData?.enabled === true && siblingData?.linkType === 'custom',
        },
      },
    ],
  },
]

export const Navbar: GlobalConfig = {
  slug: 'navbar',
  admin: {
    description: 'Configure the navigation bar links and dropdown menus',
  },
  access: {
    read: () => true,
  },
  fields: [
    // Shared quote for dropdown panels
    {
      name: 'dropdownQuote',
      type: 'group',
      label: 'Dropdown Quote',
      admin: {
        description: 'Quote displayed in the left side of dropdown panels',
      },
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Quote Text',
          admin: {
            description: 'The main quote text (without quotation marks)',
          },
        },
        {
          name: 'highlightedText',
          type: 'text',
          label: 'Highlighted Text',
          admin: {
            description: 'Part of the quote to highlight in green (must be exact match within quote)',
          },
        },
        {
          name: 'author',
          type: 'text',
          label: 'Author Name',
        },
        {
          name: 'company',
          type: 'text',
          label: 'Company Name',
        },
      ],
    },
    // Upper Navigation Links
    {
      name: 'upperLinks',
      type: 'array',
      label: 'Upper Navigation Links',
      admin: {
        description: 'Links shown in the top bar (e.g., Search, Schedule, Contact Us, Login)',
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
          defaultValue: 'custom',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: {
            description: 'Choose whether to link to an existing page or a custom URL',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType === 'page',
            description: 'Select a page to link to',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType === 'custom',
            description: 'Enter a custom URL (e.g., /contact, https://example.com)',
          },
        },
        // Dropdown configuration for upper links
        {
          name: 'hasDropdown',
          type: 'checkbox',
          label: 'Has Dropdown Menu',
          defaultValue: false,
          admin: {
            description: 'Enable dropdown menu on hover (e.g., for Search)',
          },
        },
        {
          name: 'dropdownColumns',
          type: 'array',
          label: 'Dropdown Columns',
          admin: {
            condition: (_data, siblingData) => siblingData?.hasDropdown === true,
            description: 'Configure columns for the dropdown menu',
          },
          fields: dropdownColumnFields,
        },
      ],
    },
    // Main Navigation Links
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
          defaultValue: 'custom',
          options: [
            { label: 'Page', value: 'page' },
            { label: 'Custom URL', value: 'custom' },
          ],
          admin: {
            description: 'Choose whether to link to an existing page or a custom URL',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType === 'page',
            description: 'Select a page to link to',
          },
        },
        {
          name: 'customUrl',
          type: 'text',
          admin: {
            condition: (_data, siblingData) => siblingData?.linkType === 'custom',
            description: 'Enter a custom URL (e.g., /buy, https://example.com)',
          },
        },
        // Dropdown configuration for main links
        {
          name: 'hasDropdown',
          type: 'checkbox',
          label: 'Has Dropdown Menu',
          defaultValue: false,
          admin: {
            description: 'Enable dropdown menu on hover',
          },
        },
        {
          name: 'dropdownColumns',
          type: 'array',
          label: 'Dropdown Columns',
          admin: {
            condition: (_data, siblingData) => siblingData?.hasDropdown === true,
            description: 'Configure columns for the dropdown menu',
          },
          fields: dropdownColumnFields,
        },
      ],
    },
  ],
}

