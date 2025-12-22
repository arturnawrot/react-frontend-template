import type { Block } from 'payload'

import { Hero } from './Hero'
import { FlippedM } from './FlippedM'

export const Container: Block = {
  slug: 'container',
  labels: {
    singular: 'Container',
    plural: 'Containers',
  },
  fields: [
    {
      name: 'cssStyle',
      type: 'relationship',
      relationTo: 'css-styles',
      label: 'CSS Style',
      admin: {
        description: 'Select a CSS style to apply to this container (leave empty for no style)',
      },
      filterOptions: {
        active: {
          equals: true,
        },
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Content Blocks',
      minRows: 1,
      blocks: [Hero, FlippedM],
      admin: {
        description: 'Add one or more blocks to display inside this container',
      },
    },
  ],
}

