import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const AgentDecoration: Block = {
  slug: 'agentDecoration',
  labels: {
    singular: 'Agent Decoration',
    plural: 'Agent Decorations',
  },
  fields: [
    {
      name: 'agentIconsSetName',
      type: 'text',
      required: false,
      label: 'Agent Icons Set',
      admin: {
        description: 'Select an agent icons set from the global sets to display in the decorative layout.',
        components: {
          Field: '/components/AgentIconsSetSelector/AgentIconsSetSelector',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
      defaultValue: 'Find the Right\nPartner for Your\nProperty Goals',
      admin: {
        description: 'Main heading text. Use \\n for line breaks.',
      },
    },
    ...createLinkFields({
      linkTextName: 'buttonText',
      linkTextLabel: 'Button Text',
      linkTextRequired: true,
    }),
  ],
}
