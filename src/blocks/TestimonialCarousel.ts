import type { Block } from 'payload'

export const TestimonialCarousel: Block = {
  slug: 'testimonialCarousel',
  labels: {
    singular: 'Testimonial Carousel',
    plural: 'Testimonial Carousels',
  },
  fields: [
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
}

