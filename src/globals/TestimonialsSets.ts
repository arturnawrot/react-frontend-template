import type { GlobalConfig } from 'payload'

export const TestimonialsSets: GlobalConfig = {
  slug: 'testimonialsSets',
  admin: {
    description: 'Create and manage sets of testimonials. Each set can contain any number of testimonials and can be assigned to testimonial carousel blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Testimonial Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage Testimonials", "Default Set")',
          },
        },
        {
          name: 'testimonials',
          type: 'array',
          label: 'Testimonials',
          minRows: 1,
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
              label: 'Quote',
            },
            {
              name: 'author',
              type: 'text',
              required: true,
              label: 'Author',
            },
            {
              name: 'company',
              type: 'text',
              label: 'Company',
            },
          ],
        },
      ],
    },
  ],
}
