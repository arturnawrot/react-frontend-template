import type { Block } from 'payload'

export const AgentDirectory: Block = {
  slug: 'agentDirectory',
  labels: {
    singular: 'Agent Directory',
    plural: 'Agent Directories',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Agent Directory',
    },
    {
      name: 'itemsPerPage',
      type: 'number',
      label: 'Items Per Page',
      defaultValue: 12,
      admin: {
        description: 'Number of agents to display per page',
      },
    },
  ],
}
