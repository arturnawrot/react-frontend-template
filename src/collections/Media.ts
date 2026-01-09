import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req: _req }) => {
        // Auto-generate alt text from filename if not provided during file upload
        if (operation === 'create' && data && !data.alt) {
          const filename = data.filename || 'Uploaded file'
          data.alt = filename.replace(/\.[^/.]+$/, '') // Remove file extension
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alternative text for the image/file',
      },
    },
  ],
  upload: true,
}
