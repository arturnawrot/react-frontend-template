import type { Block } from 'payload'

export const AvailableRoles: Block = {
  slug: 'availableRoles',
  labels: {
    singular: 'Available Roles',
    plural: 'Available Roles',
  },
  fields: [
    {
      name: 'availableJobSetName',
      type: 'text',
      label: 'Job Set',
      admin: {
        description: 'Select a job set from the global sets. Jobs from the selected set will be displayed.',
        components: {
          Field: '/components/AvailableJobSetSelector/AvailableJobSetSelector',
        },
      },
    },
  ],
}
