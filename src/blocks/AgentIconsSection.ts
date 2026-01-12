import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const AgentIconsSection: Block = {
  slug: 'agentIconsSection',
  labels: {
    singular: 'Agent Icons Section',
    plural: 'Agent Icons Sections',
  },
  fields: [
    {
      name: 'agentIconsSetName',
      type: 'text',
      required: false,
      label: 'Agent Icons Set',
      admin: {
        description: 'Select an agent icons set from the global sets. Defaults to "default" set.',
        components: {
          Field: '/components/AgentIconsSetSelector/AgentIconsSetSelector',
        },
      },
    },
    {
      name: 'header',
      type: 'text',
      required: true,
      label: 'Header',
    },
    {
      name: 'paragraph',
      type: 'textarea',
      required: false,
      label: 'Paragraph Text',
      admin: {
        description: 'Optional paragraph text displayed between the header and link',
      },
    },
    ...createLinkFields(),
  ],
}
