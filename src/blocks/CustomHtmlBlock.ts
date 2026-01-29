import type { Block } from 'payload'

export const CustomHtmlBlock: Block = {
  slug: 'customHtmlBlock',
  labels: {
    singular: 'Custom HTML Block',
    plural: 'Custom HTML Blocks',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'default',
      label: 'Variant',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'With Image', value: 'withImage' },
      ],
      admin: {
        description: 'Choose the layout variant',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      admin: {
        condition: (data, siblingData) => {
          const variant = data?.variant || siblingData?.variant
          return variant === 'withImage'
        },
        description: 'Image to display on the left side (only for "With Image" variant)',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      label: 'Image Alt Text',
      defaultValue: 'Section image',
      admin: {
        condition: (data, siblingData) => {
          const variant = data?.variant || siblingData?.variant
          return variant === 'withImage'
        },
      },
    },
    {
      name: 'customHtml',
      type: 'relationship',
      relationTo: 'custom-html',
      required: true,
      label: 'Custom HTML',
      admin: {
        description: 'Select a custom HTML entry from the custom-html collection',
      },
    },
    {
      name: 'justifyContent',
      type: 'select',
      required: true,
      defaultValue: 'start',
      label: 'Justify Content',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
      ],
      admin: {
        description: 'Horizontal alignment of the content',
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Heading (Optional)',
      admin: {
        description: 'Optional heading text to display inside the form card',
      },
    },
  ],
}
