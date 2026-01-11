import type { Block } from 'payload'

export const TestimonialCarousel: Block = {
  slug: 'testimonialCarousel',
  labels: {
    singular: 'Testimonial Carousel',
    plural: 'Testimonial Carousels',
  },
  fields: [
    {
      name: 'testimonialSetName',
      type: 'text',
      required: true,
      label: 'Testimonial Set',
      admin: {
        description: 'Select a testimonial set from the global sets.',
        components: {
          Field: '/components/TestimonialSetSelector/TestimonialSetSelector',
        },
      },
    },
  ],
}

