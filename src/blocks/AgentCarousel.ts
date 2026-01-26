import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

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
    ...createLinkFields({
      linkTextLabel: 'Link Text',
      linkTextRequired: false,
    }),
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
    {
      name: 'colorVariant',
      type: 'select',
      label: 'Color Variant',
      defaultValue: 'default',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'White',
          value: 'white',
        },
      ],
      admin: {
        description: 'Choose the color variant for text and arrows. White variant uses rgba(250, 249, 247, 1).',
      },
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      label: 'Vertical Alignment',
      defaultValue: 'center',
      options: [
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Start',
          value: 'start',
        },
      ],
      admin: {
        description: 'Vertically align the first column with the start of the center column.',
      },
    },
  ],
}

