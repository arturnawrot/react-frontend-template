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
      name: 'agents',
      type: 'array',
      label: 'Agents',
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
        },
        {
          name: 'role',
          type: 'text',
          label: 'Role',
          defaultValue: 'Agent',
        },
        {
          name: 'location',
          type: 'text',
          label: 'Location',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          label: 'Image',
        },
      ],
    },
  ],
}

