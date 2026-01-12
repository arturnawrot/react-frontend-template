import type { GlobalConfig } from 'payload'

export const FAQSets: GlobalConfig = {
  slug: 'faqSets',
  admin: {
    description: 'Create and manage sets of frequently asked questions. Each set can contain any number of FAQs and can be assigned to FAQ section blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'FAQ Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage FAQs", "Default Set")',
          },
        },
        {
          name: 'questions',
          type: 'array',
          label: 'Questions',
          minRows: 1,
          fields: [
            {
              name: 'question',
              type: 'text',
              required: true,
              label: 'Question',
            },
            {
              name: 'answer',
              type: 'richText',
              required: true,
              label: 'Answer',
            },
          ],
        },
      ],
    },
  ],
}
