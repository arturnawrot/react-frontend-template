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
  includeText?: boolean // Set to false to omit the link text field (default: true)
  excludeLinkTypes?: string[] // Filter out these linkType values from the select options
  defaultLinkType?: string // Override the default linkType value (default: 'none')
}): Field[] {
  const linkTextName = options?.linkTextName || 'linkText'
  const linkTextLabel = options?.linkTextLabel || 'Link Text'
  const linkTextRequired = options?.linkTextRequired || false
  const prefix = options?.fieldPrefix || ''
  const includeText = options?.includeText !== false
  const excludeLinkTypes = options?.excludeLinkTypes || []
  const defaultLinkType = options?.defaultLinkType || 'none'

  const linkTypeName = prefix ? `${prefix}LinkType` : 'linkType'
  const pageName = prefix ? `${prefix}Page` : 'page'
  const customUrlName = prefix ? `${prefix}CustomUrl` : 'customUrl'
  const constantLinkName = prefix ? `${prefix}ConstantLink` : 'constantLink'

  const openInNewTabName = prefix ? `${prefix}OpenInNewTab` : 'openInNewTab'
  const disabledName = prefix ? `${prefix}Disabled` : 'disabled'
  const calLinkName = prefix ? `${prefix}CalLink` : 'calLink'
  const calNamespaceName = prefix ? `${prefix}CalNamespace` : 'calNamespace'

  return [
    ...(includeText
      ? [
          {
            name: linkTextName,
            type: 'text' as const,
            label: linkTextLabel,
            required: linkTextRequired,
          },
        ]
      : []),
    {
      name: linkTypeName,
      type: 'select',
      required: false,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Page', value: 'page' },
        { label: 'Custom URL', value: 'custom' },
        { label: 'Constant Link', value: 'constant' },
        { label: 'Cal.com Booking', value: 'cal' },
      ].filter((opt) => !excludeLinkTypes.includes(opt.value)),
      defaultValue: defaultLinkType,
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
      name: calLinkName,
      type: 'text',
      required: false,
      admin: {
        condition: (data, siblingData) => siblingData?.[linkTypeName] === 'cal',
        description: 'Cal.com link path (e.g., team/meybohm/consult)',
      },
    },
    {
      name: calNamespaceName,
      type: 'text',
      required: false,
      admin: {
        condition: (data, siblingData) => siblingData?.[linkTypeName] === 'cal',
        description: 'Cal.com namespace — must match the Cal("init") call (e.g., consult)',
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
          return linkType !== 'none' && linkType !== undefined && linkType !== null && linkType !== 'cal' && linkType !== 'constant'
        },
        description: 'Open the link in a new browser tab',
      },
    },
    {
      name: disabledName,
      type: 'checkbox',
      label: 'Disabled',
      defaultValue: false,
      admin: {
        condition: (data, siblingData) => {
          const linkType = siblingData?.[linkTypeName]
          return linkType !== 'none' && linkType !== undefined && linkType !== null && linkType !== 'cal' && linkType !== 'constant'
        },
        description: 'Disable the link (renders as non-clickable text)',
      },
    },
  ]
}
