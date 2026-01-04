import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'location', 'employmentType', 'createdAt'],
  },
  access: {
    read: () => true, // Public read access
    create: ({ req: { user } }) => Boolean(user), // Authenticated users can create
    update: ({ req: { user } }) => Boolean(user), // Authenticated users can update
    delete: ({ req: { user } }) => Boolean(user), // Authenticated users can delete
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Job title (e.g., "Investment Analyst")',
      },
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'department',
      type: 'text',
      required: true,
      admin: {
        description: 'Department name (e.g., "Investments / Capital Markets")',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      admin: {
        description: 'Job location (e.g., "Augusta, GA (3519 Wheeler Road)")',
      },
    },
    {
      name: 'employmentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Full-Time', value: 'full-time' },
        { label: 'Part-Time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Temporary', value: 'temporary' },
      ],
      defaultValue: 'full-time',
      admin: {
        description: 'Employment type',
      },
    },
    {
      name: 'reportsTo',
      type: 'text',
      required: false,
      admin: {
        description: 'Who this position reports to (e.g., "Director of Capital Markets")',
      },
    },
    {
      name: 'jobDescription',
      type: 'richText',
      required: true,
      admin: {
        description: 'Full job description content',
      },
    },
    {
      name: 'applyUrl',
      type: 'text',
      required: false,
      admin: {
        description: 'Optional external URL for the "Apply Now" button. If empty, an internal application form will be shown.',
      },
    },
    {
      name: 'customFields',
      type: 'array',
      required: false,
      admin: {
        description: 'Additional custom fields to display in job details',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  timestamps: true,
}

