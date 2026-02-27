import type { GlobalConfig } from 'payload'
import { createLinkFields } from '@/fields/linkField'
import crypto from 'crypto'

export const ConstantLinks: GlobalConfig = {
  slug: 'constantLinks',
  admin: {
    description: 'Manage constant links that can be used across blocks. These links can be updated in one place and will automatically update everywhere they are used.',
  },
  access: {
    read: () => true, // Public read access
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Populate customUrl from legacy url on read so the admin UI shows the value
        if (doc?.links && Array.isArray(doc.links)) {
          for (const link of doc.links) {
            if (link.url && !link.customUrl) {
              link.customUrl = link.url
              link.linkType = link.linkType || 'custom'
            }
          }
        }
        return doc
      },
    ],
    beforeChange: [
      ({ data }) => {
        if (data?.links && Array.isArray(data.links)) {
          for (const link of data.links) {
            // Auto-generate key for new entries
            if (!link.key) {
              link.key = crypto.randomUUID()
            }
            // Migrate legacy url → customUrl and clear url
            if (link.url && !link.customUrl) {
              link.customUrl = link.url
              link.linkType = link.linkType || 'custom'
            }
            if (link.url && link.customUrl) {
              link.url = undefined
            }
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'links',
      type: 'array',
      label: 'Constant Links',
      minRows: 0,
      admin: {
        description: 'Define constant links that can be referenced by blocks. When you update a link here, it will automatically update everywhere it is used.',
      },
      fields: [
        {
          name: 'key',
          type: 'text',
          required: true,
          admin: {
            hidden: true,
            description: 'Auto-generated unique identifier',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            description: 'Display name for this constant link (e.g., "Contact Us", "About Us", "Apply Now")',
          },
        },
        // Legacy url field — hidden, kept for backward compatibility with existing entries
        {
          name: 'url',
          type: 'text',
          label: 'Legacy URL',
          admin: {
            hidden: true,
          },
        },
        // Full linkType fields (page, custom, cal — excluding none and constant)
        ...createLinkFields({
          includeText: false,
          excludeLinkTypes: ['none', 'constant'],
          defaultLinkType: 'custom',
        }),
      ],
    },
  ],
}
