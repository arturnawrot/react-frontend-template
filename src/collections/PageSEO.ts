import type { CollectionConfig } from 'payload'

const TEMPLATE_VARIABLES: Record<string, string[]> = {
  agents: ['firstName', 'lastName', 'fullName', 'displayTitle', 'roles', 'specialties', 'servingLocations', 'email', 'phone'],
  jobs: ['title', 'department', 'location', 'employmentType', 'reportsTo'],
  blogs: ['title', 'description', 'type', 'author', 'categories'],
  properties: ['address', 'city', 'state', 'propertyType', 'buildingSize', 'salePrice'],
}

function variableHelpText(pageType: string): string {
  const vars = TEMPLATE_VARIABLES[pageType]
  if (!vars) return ''
  return `Available variables: ${vars.map((v) => `{${v}}`).join(', ')}`
}

export const PageSEO: CollectionConfig = {
  slug: 'page-seo',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['pageType', 'path', 'title', 'updatedAt'],
    group: 'Settings',
    description: 'SEO metadata for static pages and dynamic page templates (agents, jobs, blogs, properties)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'pageType',
      type: 'select',
      required: true,
      defaultValue: 'static',
      options: [
        { label: 'Static Page', value: 'static' },
        { label: 'Agent Pages', value: 'agents' },
        { label: 'Job Pages', value: 'jobs' },
        { label: 'Blog Pages', value: 'blogs' },
        { label: 'Property Pages', value: 'properties' },
      ],
      admin: {
        description: 'Static Page: SEO for a specific URL path. Dynamic types: SEO template with {variable} placeholders for all pages of that type.',
      },
    },
    {
      name: 'path',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        placeholder: '/about or /agents',
        description: 'The URL path (e.g., /about, /contact, /agents)',
        condition: (_data, siblingData) => siblingData?.pageType === 'static',
      },
      validate: (value: string | null | undefined, { siblingData }: any) => {
        if (siblingData?.pageType !== 'static') return true
        if (!value) return 'Path is required for static pages'
        if (!value.startsWith('/')) return 'Path must start with /'
        return true
      },
    },
    {
      name: 'templateVariablesInfo',
      type: 'ui',
      admin: {
        condition: (_data, siblingData) => siblingData?.pageType && siblingData.pageType !== 'static',
        components: {
          Field: '/components/TemplateVariablesInfo',
        },
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Page title for search engines. For dynamic types, use {variable} placeholders (e.g., "{fullName} | Meybohm Real Estate").',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Meta description for search engines (recommended: 150-160 characters). For dynamic types, use {variable} placeholders.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Default image for social media sharing (Open Graph). For dynamic types, the entity image takes priority if available.',
      },
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Prevent search engines from indexing this page',
      },
    },
  ],
}

export { TEMPLATE_VARIABLES }
