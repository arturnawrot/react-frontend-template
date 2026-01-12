import type { GlobalConfig } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const AgentCategories: GlobalConfig = {
  slug: 'agentCategories',
  admin: {
    description: 'Manage agent categories with colors and featured agents. Each category displays 3 agents when expanded.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Expertise That Moves Markets',
      admin: {
        description: 'Main heading for the agents by category section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Our agents specialize in everything from raw land and infill redevelopment to national net-lease portfolios.',
      admin: {
        description: 'Description text below the heading',
      },
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Categories',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Category Title',
          admin: {
            description: 'Title of the category (e.g., "Land / Infill", "Industrial / Flex")',
          },
        },
        {
          name: 'backgroundColor',
          type: 'text',
          required: true,
          label: 'Background Color',
          defaultValue: '#F2F7D5',
          admin: {
            description: 'Background color in hex format (e.g., #F2F7D5). This will be used as the category background.',
          },
        },
        ...createLinkFields({
          linkTextLabel: 'Link Text',
          linkTextRequired: false,
        }),
        {
          name: 'agents',
          type: 'relationship',
          relationTo: 'agents',
          hasMany: true,
          required: true,
          minRows: 3,
          maxRows: 3,
          label: 'Agents',
          admin: {
            description: 'Select exactly 3 agents to display for this category',
          },
        },
      ],
    },
  ],
}
