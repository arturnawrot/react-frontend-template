import type { GlobalConfig, Field } from 'payload'
import { createLinkFields } from '@/fields/linkField'

// Reusable link fields for dropdown column links (uses same pattern as createLinkFields but with label instead of linkText)
const columnLinkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
    label: 'Link Label',
  },
  {
    name: 'linkType',
    type: 'select',
    required: false,
    options: [
      { label: 'None', value: 'none' },
      { label: 'Page', value: 'page' },
      { label: 'Custom URL', value: 'custom' },
      { label: 'Constant Link', value: 'constant' },
    ],
    defaultValue: 'custom',
    admin: {
      description: 'Choose whether to link to an existing page, a custom URL, a constant link, or no link',
    },
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    required: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'page',
      description: 'Select a page to link to',
    },
  },
  {
    name: 'customUrl',
    type: 'text',
    required: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'custom',
      description: 'Enter a custom URL (e.g., /contact, https://example.com)',
    },
  },
  {
    name: 'constantLink',
    type: 'text',
    required: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.linkType === 'constant',
      description: 'Select a constant link. These links can be managed globally and updated in one place.',
      components: {
        Field: '/components/ConstantLinkSelector/ConstantLinkSelector',
      },
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Open in New Tab',
    defaultValue: false,
    admin: {
      condition: (_data, siblingData) => {
        const linkType = siblingData?.linkType
        return linkType !== 'none' && linkType !== undefined && linkType !== null && linkType !== 'constant'
      },
      description: 'Open the link in a new browser tab',
    },
  },
]

// Bottom link fields with enabled toggle
const bottomLinkFields: Field[] = [
  {
    name: 'enabled',
    type: 'checkbox',
    label: 'Show Bottom Link',
    defaultValue: false,
  },
  {
    name: 'label',
    type: 'text',
    label: 'Link Label',
    admin: {
      condition: (_data, siblingData) => siblingData?.enabled === true,
      description: 'e.g., "See All Property Types"',
    },
  },
  {
    name: 'linkType',
    type: 'select',
    required: false,
    options: [
      { label: 'None', value: 'none' },
      { label: 'Page', value: 'page' },
      { label: 'Custom URL', value: 'custom' },
      { label: 'Constant Link', value: 'constant' },
    ],
    defaultValue: 'custom',
    admin: {
      condition: (_data, siblingData) => siblingData?.enabled === true,
      description: 'Choose whether to link to an existing page, a custom URL, a constant link, or no link',
    },
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    required: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.enabled === true && siblingData?.linkType === 'page',
      description: 'Select a page to link to',
    },
  },
  {
    name: 'customUrl',
    type: 'text',
    required: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.enabled === true && siblingData?.linkType === 'custom',
      description: 'Enter a custom URL (e.g., /contact, https://example.com)',
    },
  },
  {
    name: 'constantLink',
    type: 'text',
    required: false,
    admin: {
      condition: (_data, siblingData) => siblingData?.enabled === true && siblingData?.linkType === 'constant',
      description: 'Select a constant link. These links can be managed globally and updated in one place.',
      components: {
        Field: '/components/ConstantLinkSelector/ConstantLinkSelector',
      },
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox',
    label: 'Open in New Tab',
    defaultValue: false,
    admin: {
      condition: (_data, siblingData) => {
        if (!siblingData?.enabled) return false
        const linkType = siblingData?.linkType
        return linkType !== 'none' && linkType !== undefined && linkType !== null && linkType !== 'constant'
      },
      description: 'Open the link in a new browser tab',
    },
  },
]

// Dropdown column fields (reused for both upper and main links)
const dropdownColumnFields: Field[] = [
  {
    name: 'columnName',
    type: 'text',
    required: true,
    label: 'Column Title',
    admin: {
      description: 'e.g., "Needs", "Property Types", "Frequently Used Links"',
    },
  },
  {
    name: 'links',
    type: 'array',
    label: 'Column Links',
    fields: columnLinkFields,
  },
  {
    name: 'bottomLink',
    type: 'group',
    label: 'Bottom Link (Optional)',
    admin: {
      description: 'Optional "See All..." link at the bottom of the column',
    },
    fields: bottomLinkFields,
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
        ...createLinkFields({
          linkTextName: 'label',
          linkTextLabel: 'Link Label',
          linkTextRequired: true,
        }),
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
        ...createLinkFields({
          linkTextName: 'label',
          linkTextLabel: 'Link Label',
          linkTextRequired: true,
        }),
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
