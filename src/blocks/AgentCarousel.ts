import type { Block } from 'payload'

export const AgentCarousel: Block = {
  slug: 'agentCarousel',
  labels: {
    singular: 'Agent Carousel',
    plural: 'Agent Carousels',
  },
  fields: [
    {
      name: 'preHeading',
      type: 'text',
      label: 'Pre Heading',
      defaultValue: 'Meet Our Agents',
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Experience that Performs',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: "We're proud to bring a wealth of knowledge and relational capital to every deal and partnership.",
    },
    {
      name: 'linkText',
      type: 'text',
      label: 'Link Text',
      defaultValue: 'Find an Agent',
    },
    {
      name: 'linkHref',
      type: 'text',
      label: 'Link URL',
      defaultValue: '#',
    },
    {
      name: 'featuredAgentSetName',
      type: 'text',
      required: true,
      defaultValue: 'default',
      admin: {
        description: 'Select a featured agents set from the global sets. Defaults to "default" set.',
        components: {
          Field: '/components/FeaturedAgentSetSelector/FeaturedAgentSetSelector',
        },
      },
    },
  ],
}

