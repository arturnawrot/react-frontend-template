import type { CollectionConfig } from 'payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'job', 'email', 'phone', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user), // Only authenticated users can read
    create: () => true, // Anyone can create (public applications)
    update: ({ req: { user } }) => Boolean(user), // Only authenticated users can update
    delete: ({ req: { user } }) => Boolean(user), // Only authenticated users can delete
  },
  fields: [
    {
      name: 'job',
      type: 'relationship',
      relationTo: 'jobs',
      required: true,
      admin: {
        description: 'The job this application is for',
      },
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated from first and last name',
      },
      hooks: {
        beforeChange: [
          ({ data, siblingData }) => {
            const firstName = siblingData?.firstName || data?.firstName || ''
            const lastName = siblingData?.lastName || data?.lastName || ''
            return `${firstName} ${lastName}`.trim()
          },
        ],
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Resume in PDF format',
      },
    },
    {
      name: 'additionalInfo',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Additional information from the applicant',
      },
    },
  ],
  timestamps: true,
}

