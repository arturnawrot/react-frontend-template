import type { CollectionConfig } from 'payload'

export const StaticFiles: CollectionConfig = {
  slug: 'static-files',
  admin: {
    useAsTitle: 'path',
    description:
      'Files served at the domain root. E.g. path "google-abc.txt" → domain.com/google-abc.txt',
    defaultColumns: ['path', 'contentType', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'URL path without leading slash. Examples: "google-site-verification.txt", ".well-known/security.txt"',
        placeholder: 'google-site-verification.txt',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'contentType',
      label: 'Content-Type',
      type: 'text',
      defaultValue: 'text/plain; charset=utf-8',
      admin: {
        description: 'MIME type header returned with the file. Defaults to text/plain.',
      },
    },
  ],
}
