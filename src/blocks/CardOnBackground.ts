import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const CardOnBackground: Block = {
  slug: 'cardOnBackground',
  labels: {
    singular: 'Card on Background',
    plural: 'Cards on Background',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Commercial Brokerage With Real Momentum',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subheading',
      defaultValue: "We're growing - and always looking for strong talent. If you're client-first, strategic, and hungry to grow, we want to talk.",
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Upload an image or leave empty to use default',
      },
    },
    ...createLinkFields({
      linkTextName: 'ctaText',
      linkTextLabel: 'CTA Text',
      linkTextRequired: false,
    }),
    {
      name: 'excludeSpacing',
      type: 'checkbox',
      label: 'Exclude Default Spacing',
      defaultValue: false,
      admin: {
        description: 'When enabled, this block will not have default spacing applied (useful for full-width sections that should connect with adjacent blocks)',
      },
    },
  ],
}
