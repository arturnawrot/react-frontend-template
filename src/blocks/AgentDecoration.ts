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
      name: 'variant',
      type: 'select',
      label: 'Variant',
      defaultValue: 'full',
      options: [
        { label: 'Full (8 icons, button)', value: 'full' },
        { label: 'Compact (fewer icons, bullet points)', value: 'compact' },
      ],
      admin: {
        description: 'Choose layout variant',
      },
    },
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
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      required: false,
      admin: {
        description: 'Optional description text below the heading (used in compact variant)',
        condition: (data, siblingData) => siblingData?.variant === 'compact',
      },
    },
    {
      name: 'bulletPoints',
      type: 'array',
      label: 'Bullet Points',
      maxRows: 6,
      admin: {
        description: 'Bullet points displayed in 2 columns (used in compact variant)',
        condition: (data, siblingData) => siblingData?.variant === 'compact',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Bullet Point Text',
        },
      ],
    },
    ...createLinkFields({
      linkTextName: 'buttonText',
      linkTextLabel: 'Button Text',
      linkTextRequired: false,
    }),
  ],
}
