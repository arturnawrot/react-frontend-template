import type { CollectionConfig } from 'payload'

export const Agents: CollectionConfig = {
  slug: 'agents',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'URL slug (auto-generated from firstname-lastname)',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Background image for hero section (used in agent page)',
      },
    },
    {
      name: 'cardImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Card/thumbnail image (used in agent cards and listings)',
      },
    },
    {
      name: 'roles',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'role',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Agent roles (e.g., "Buyer Rep", "Tenant Rep", "Dispositions")',
      },
    },
    {
      name: 'specialties',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'specialty',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Agent specialties (e.g., "Land", "Retail", "STNL", "Industrial", "Office")',
      },
    },
    {
      name: 'servingLocations',
      type: 'array',
      required: false,
      fields: [
        {
          name: 'location',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Locations the agent serves (e.g., "Augusta", "Savannah", "Statesboro")',
      },
    },
    {
      name: 'about',
      type: 'richText',
      required: false,
      admin: {
        description: 'About section content for the agent',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: false,
    },
    {
      name: 'phone',
      type: 'text',
      required: false,
    },
    {
      name: 'linkedin',
      type: 'text',
      required: false,
      admin: {
        description: 'LinkedIn profile URL',
      },
    },
    {
      name: 'buildout_broker_id',
      type: 'text',
      required: false,
      admin: {
        description: 'Enter broker email address to automatically fetch Buildout broker ID',
        components: {
          Field: '/components/BuildoutBrokerIdField',
        },
      },
    },
    {
      name: 'featuredPropertySetName',
      type: 'text',
      required: false,
      admin: {
        description: 'Select a featured properties set from the global sets. Leave empty to use manually selected properties below.',
        components: {
          Field: '/components/FeaturedPropertySetSelector/FeaturedPropertySetSelector',
        },
      },
    },
    {
      name: 'featuredPropertyIds',
      type: 'json',
      required: false,
      admin: {
        description: 'Buildout property IDs marked as featured listings (max 4 allowed). Stored as JSON array of numbers. Only used if no featured property set is selected above.',
        hidden: true, // Hidden from form, managed by dashboard component
      },
    },
    {
      name: 'propertiesDashboard',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/AgentPropertiesDashboard',
        },
      },
    },
    {
      name: 'fullName',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-generated full name',
      },
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from firstName-lastName
        if (data && data.firstName && data.lastName) {
          const firstName = data.firstName.toLowerCase().trim()
          const lastName = data.lastName.toLowerCase().trim()
          data.slug = `${firstName}-${lastName}`
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, operation, originalDoc }) => {
        // Ensure fullName is set
        if (data.firstName && data.lastName) {
          data.fullName = `${data.firstName} ${data.lastName}`
        }

        // Reset featured properties when buildout_broker_id changes
        if (operation === 'update' && originalDoc) {
          const oldBrokerId = originalDoc.buildout_broker_id
          const newBrokerId = data.buildout_broker_id

          // Check if broker ID has changed (including null/undefined cases)
          if (oldBrokerId !== newBrokerId) {
            // Reset featured property IDs to empty array
            data.featuredPropertyIds = []
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}

