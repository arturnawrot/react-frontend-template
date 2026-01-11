import type { Block } from 'payload'

export const TrackRecordSection: Block = {
  slug: 'trackRecordSection',
  labels: {
    singular: 'Track Record Section',
    plural: 'Track Record Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Heading',
      defaultValue: 'Proven Track Record',
    },
    {
      name: 'provenTrackRecordSetName',
      type: 'text',
      label: 'Proven Track Record Set',
      admin: {
        description: 'Select a proven track record set from the global sets. Items from the selected set will be displayed.',
        components: {
          Field: '/components/ProvenTrackRecordSetSelector/ProvenTrackRecordSetSelector',
        },
      },
    },
  ],
}

