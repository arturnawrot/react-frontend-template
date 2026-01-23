import type { GlobalConfig } from 'payload'
import { createLinkFields } from '@/fields/linkField'

export const OfficeLocationSets: GlobalConfig = {
  slug: 'officeLocationSets',
  admin: {
    description: 'Create and manage sets of office location cards. Each set can contain multiple office locations and can be assigned to Office Locations section blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Office Location Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Homepage Offices", "Contact Page Offices")',
          },
        },
        {
          name: 'locations',
          type: 'array',
          label: 'Office Locations',
          minRows: 1,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Background Image',
              admin: {
                description: 'Background image for the office location card',
              },
            },
            {
              name: 'header',
              type: 'text',
              required: true,
              label: 'Header',
              admin: {
                description: 'Office location header (e.g., "Augusta, GA") - will be displayed using SectionHeader styling',
              },
            },
            {
              name: 'subheader',
              type: 'text',
              label: 'Subheader',
              admin: {
                description: 'Address or additional info (e.g., "3519 Wheeler Road, Augusta, GA 30909")',
              },
            },
            {
              name: 'office',
              type: 'text',
              label: 'Office Phone',
              admin: {
                description: 'Office phone number (e.g., "706.736.0700")',
              },
            },
            {
              name: 'fax',
              type: 'text',
              label: 'Fax Number',
              admin: {
                description: 'Fax number (e.g., "706.736.5363")',
              },
            },
            ...createLinkFields({
              linkTextName: 'linkText',
              linkTextLabel: 'Link Text',
              linkTextRequired: false,
              fieldPrefix: '',
            }),
          ],
        },
      ],
    },
  ],
}
