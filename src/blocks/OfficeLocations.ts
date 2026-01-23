import type { Block } from 'payload'

export const OfficeLocations: Block = {
  slug: 'officeLocations',
  labels: {
    singular: 'Office Locations',
    plural: 'Office Locations',
  },
  fields: [
    {
      name: 'officeLocationSetName',
      type: 'text',
      label: 'Office Location Set',
      admin: {
        description: 'Select an Office Location set from the global sets. Cards from the selected set will be displayed.',
        components: {
          Field: '/components/OfficeLocationSetSelector/OfficeLocationSetSelector',
        },
      },
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Office Locations',
      admin: {
        description: 'Main heading for the section (uses SectionHeading styling)',
      },
    },
  ],
}
