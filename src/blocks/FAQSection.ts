import type { Block } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const FAQSection: Block = {
  slug: 'faqSection',
  labels: {
    singular: 'FAQ Section',
    plural: 'FAQ Sections',
  },
  fields: [
    {
      name: 'faqSetName',
      type: 'text',
      label: 'FAQ Set',
      admin: {
        description: 'Select an FAQ set from the global sets. Questions from the selected set will be displayed.',
        components: {
          Field: '/components/FAQSetSelector/FAQSetSelector',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'FAQs',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      defaultValue: 'Common questions from our clients. Feel free to reach out with more.',
    },
    ...createLinkFields({
      linkTextLabel: 'Contact Button Text',
      linkTextRequired: false,
      linkTextName: 'contactButtonText',
    }),
  ],
}
