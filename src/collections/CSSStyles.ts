import type { CollectionConfig } from 'payload'

export const CSSStyles: CollectionConfig = {
  slug: 'css-styles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'cssClass', 'active', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Style Name',
      admin: {
        description: 'Display name for this CSS style (e.g., "Sand Gradient")',
      },
    },
    {
      name: 'cssClass',
      type: 'text',
      required: true,
      label: 'CSS Class Name',
      unique: true,
      admin: {
        description: 'CSS class name (e.g., "sand-gradient-background")',
      },
    },
    {
      name: 'css',
      type: 'code',
      required: true,
      label: 'CSS Code',
      admin: {
        language: 'css',
        description: 'The CSS code for this style. Include the class selector.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Only active styles will appear in the Container block selector',
      },
    },
  ],
  timestamps: true,
}

