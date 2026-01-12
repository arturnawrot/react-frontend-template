import type { GlobalConfig } from 'payload'

export const AgentIconsSets: GlobalConfig = {
  slug: 'agentIconsSets',
  admin: {
    description: 'Create and manage sets of agent icons. Each set can contain up to 13 agents and can be assigned to agent icons section blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Agent Icon Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage Icons", "Default Set")',
          },
        },
        {
          name: 'agents',
          type: 'relationship',
          relationTo: 'agents',
          hasMany: true,
          required: false,
          maxRows: 13,
          label: 'Agents',
          admin: {
            description: 'Select agents to include in this set (max 13 agents)',
          },
        },
      ],
    },
  ],
}
