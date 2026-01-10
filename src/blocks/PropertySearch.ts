import type { Block } from 'payload'

export const PropertySearch: Block = {
  slug: 'propertySearch',
  labels: {
    singular: 'Property Search',
    plural: 'Property Searches',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Local Insight. National Scale.',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.',
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      defaultValue: 'Explore Properties by Market',
    },
    {
      name: 'propertiesCount',
      type: 'text',
      label: 'Properties Count Text',
      defaultValue: '99 Properties For Sale in or near Aiken',
    },
  ],
}

