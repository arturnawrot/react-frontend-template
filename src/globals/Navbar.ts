import type { GlobalConfig, Field } from 'payload'
import { createLinkFields } from '@/fields/linkField'

// Reusable link fields for dropdown column links
const columnLinkFields: Field[] = [
  ...createLinkFields({
    linkTextName: 'label',
    linkTextLabel: 'Link Label',
    linkTextRequired: true,
    defaultLinkType: 'custom',
  }),
]

// Wraps each field's admin.condition with an additional `enabled` gate
function withEnabledGate(fields: Field[]): Field[] {
  return fields.map((field) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingCondition = 'admin' in field ? (field.admin as any)?.condition : undefined
    return {
      ...field,
      admin: {
        ...('admin' in field ? field.admin : {}),
        condition: (_data: unknown, siblingData: Record<string, unknown>) => {
          if (!siblingData?.enabled) return false
          return existingCondition ? existingCondition(_data, siblingData) : true
        },
      },
    } as Field
  })
}

// Bottom link fields with enabled toggle — all link fields gated behind `enabled` checkbox
const bottomLinkFields: Field[] = [
  {
    name: 'enabled',
    type: 'checkbox',
    label: 'Show Bottom Link',
    defaultValue: false,
  },
  ...withEnabledGate(
    createLinkFields({
      linkTextName: 'label',
      linkTextLabel: 'Link Label',
      defaultLinkType: 'custom',
    }),
  ),
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
