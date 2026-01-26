import type { GlobalConfig } from 'payload'

export const FAQFullPage: GlobalConfig = {
  slug: 'faqFullPage',
  admin: {
    description: 'Full page FAQ configuration with categories and questions. This global is used by the FAQSectionFull block.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'categories',
      type: 'array',
      label: 'FAQ Categories',
      minRows: 0,
      fields: [
        {
          name: 'categoryName',
          type: 'text',
          required: true,
          label: 'Category Name',
          admin: {
            description: 'The heading for this category (e.g., "Listing and Property Search")',
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
