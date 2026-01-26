import type { Field } from 'payload'

/**
 * Creates a reusable link field group with linkType selector
 * that allows choosing between Page relationship, Custom URL, Constant Link, or None
 */
export function createLinkFields(options?: {
  linkTextName?: string
  linkTextLabel?: string
  linkTextRequired?: boolean
  fieldPrefix?: string // Prefix for linkType, page, and customUrl fields
}): Field[] {
  const linkTextName = options?.linkTextName || 'linkText'
  const linkTextLabel = options?.linkTextLabel || 'Link Text'
  const linkTextRequired = options?.linkTextRequired || false
  const prefix = options?.fieldPrefix || ''

  const linkTypeName = prefix ? `${prefix}LinkType` : 'linkType'
  const pageName = prefix ? `${prefix}Page` : 'page'
  const customUrlName = prefix ? `${prefix}CustomUrl` : 'customUrl'
  const constantLinkName = prefix ? `${prefix}ConstantLink` : 'constantLink'

  const openInNewTabName = prefix ? `${prefix}OpenInNewTab` : 'openInNewTab'

  return [
    {
      name: linkTextName,
      type: 'text',
      label: linkTextLabel,
      required: linkTextRequired,
    },
    {
      name: linkTypeName,
      type: 'select',
      required: false,
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Page',
          value: 'page',
        },
        {
          label: 'Custom URL',
          value: 'custom',
        },
        {
          label: 'Constant Link',
          value: 'constant',
        },
      ],
      defaultValue: 'none',
      admin: {
        description: 'Choose whether to link to an existing page, a custom URL, a constant link, or no link',
      },
    },
    {
      name: pageName,
      type: 'relationship',
      relationTo: 'pages',
      required: false,
      admin: {
        condition: (data, siblingData) => {
          const linkType = siblingData?.[linkTypeName]
          return linkType === 'page'
        },
        description: 'Select a page to link to',
      },
    },
    {
      name: customUrlName,
      type: 'text',
      required: false,
      admin: {
        condition: (data, siblingData) => {
          const linkType = siblingData?.[linkTypeName]
          return linkType === 'custom'
        },
        description: 'Enter a custom URL (e.g., /contact, https://example.com)',
      },
    },
    {
      name: constantLinkName,
      type: 'text',
      required: false,
      admin: {
        condition: (data, siblingData) => {
          const linkType = siblingData?.[linkTypeName]
          return linkType === 'constant'
        },
        description: 'Select a constant link. These links can be managed globally and updated in one place.',
        components: {
          Field: '/components/ConstantLinkSelector/ConstantLinkSelector',
        },
      },
    },
    {
      name: openInNewTabName,
      type: 'checkbox',
      label: 'Open in New Tab',
      defaultValue: false,
      admin: {
        condition: (data, siblingData) => {
          const linkType = siblingData?.[linkTypeName]
          return linkType !== 'none' && linkType !== undefined && linkType !== null
        },
        description: 'Open the link in a new browser tab',
      },
    },
  ]
}
