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
      type: 'json',
      required: false,
      admin: {
        description: 'Sets of featured agents. Managed via the agent selector below.',
        hidden: true, // Hidden from form, managed by FeaturedAgentsSetManager component
      },
    },
    {
      name: 'setManager',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/FeaturedAgentsSetManager',
        },
      },
    },
  ],
}

