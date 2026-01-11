import type { GlobalConfig } from 'payload'

export const FeaturedAgentsSets: GlobalConfig = {
  slug: 'featuredAgentsSets',
  admin: {
    description: 'Create and manage sets of featured agents. Each set can contain any number of agents and can be assigned to agent carousel blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Agent Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage Featured", "Default Set")',
          },
        },
        {
          name: 'agents',
          type: 'relationship',
          relationTo: 'agents',
          hasMany: true,
          required: false,
          label: 'Agents',
          admin: {
            description: 'Select agents to include in this set',
          },
        },
      ],
    },
  ],
}

