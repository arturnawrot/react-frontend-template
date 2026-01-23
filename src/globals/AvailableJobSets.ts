import type { GlobalConfig } from 'payload'

export const AvailableJobSets: GlobalConfig = {
  slug: 'availableJobSets',
  admin: {
    description: 'Create and manage sets of available jobs/roles. Each set can contain any number of jobs and can be assigned to Available Roles section blocks.',
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'sets',
      type: 'array',
      label: 'Job Sets',
      minRows: 0,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Set Name',
          admin: {
            description: 'A unique name for this set (e.g., "Careers Page Jobs", "Commercial Roles")',
          },
        },
        {
          name: 'jobs',
          type: 'relationship',
          relationTo: 'jobs',
          hasMany: true,
          label: 'Jobs',
          admin: {
            description: 'Select jobs to include in this set',
          },
        },
      ],
    },
  ],
}
