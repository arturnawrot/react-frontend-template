import type { GlobalConfig } from 'payload'

export const SEOSettings: GlobalConfig = {
  slug: 'seoSettings',
  admin: {
    description: 'Configure SEO settings including robots.txt and sitemap.xml',
    group: 'Settings',
  },
  access: {
    read: () => true, // Public read access needed to serve robots.txt and sitemap
  },
  fields: [
    // Robots.txt Configuration
    {
      name: 'robotsConfig',
      type: 'group',
      label: 'Robots.txt Configuration',
      admin: {
        description: 'Configure the robots.txt file for search engine crawlers',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable robots.txt',
          defaultValue: true,
          admin: {
            description: 'When enabled, a robots.txt file will be served at /robots.txt',
          },
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Custom robots.txt Content',
          defaultValue: `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /admin
Disallow: /api/

# Allow search engines to crawl important pages
Allow: /property-search
Allow: /agents
Allow: /blog
Allow: /article
Allow: /market-report
Allow: /investment-spotlight
Allow: /jobs
Allow: /saved-properties`,
          admin: {
            description: 'Custom robots.txt content. The sitemap URL will be automatically appended if sitemap is enabled.',
            condition: (data) => data?.robotsConfig?.enabled,
            rows: 15,
          },
        },
      ],
    },

    // Sitemap Configuration
    {
      name: 'sitemapConfig',
      type: 'group',
      label: 'Sitemap.xml Configuration',
      admin: {
        description: 'Configure the sitemap.xml file for search engines',
      },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable sitemap.xml',
          defaultValue: true,
          admin: {
            description: 'When enabled, a sitemap.xml file will be served at /sitemap.xml',
          },
        },
        {
          name: 'includePages',
          type: 'checkbox',
          label: 'Include CMS Pages',
          defaultValue: true,
          admin: {
            description: 'Include pages from the Pages collection',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'includeAgents',
          type: 'checkbox',
          label: 'Include Agents',
          defaultValue: true,
          admin: {
            description: 'Include agent profiles from the Agents collection',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'includeProperties',
          type: 'checkbox',
          label: 'Include Properties',
          defaultValue: true,
          admin: {
            description: 'Include properties from the Buildout API',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'includeBlogs',
          type: 'checkbox',
          label: 'Include Blog Posts',
          defaultValue: true,
          admin: {
            description: 'Include articles, market reports, and investment spotlights',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'includeJobs',
          type: 'checkbox',
          label: 'Include Job Listings',
          defaultValue: true,
          admin: {
            description: 'Include job listings from the Jobs collection',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'includeStaticPages',
          type: 'checkbox',
          label: 'Include Static Pages',
          defaultValue: true,
          admin: {
            description: 'Include static pages like property-search, saved-properties, etc.',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'defaultChangeFrequency',
          type: 'select',
          label: 'Default Change Frequency',
          defaultValue: 'weekly',
          options: [
            { label: 'Always', value: 'always' },
            { label: 'Hourly', value: 'hourly' },
            { label: 'Daily', value: 'daily' },
            { label: 'Weekly', value: 'weekly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Yearly', value: 'yearly' },
            { label: 'Never', value: 'never' },
          ],
          admin: {
            description: 'How frequently pages are likely to change',
            condition: (data) => data?.sitemapConfig?.enabled,
          },
        },
        {
          name: 'defaultPriority',
          type: 'number',
          label: 'Default Priority',
          defaultValue: 0.5,
          min: 0,
          max: 1,
          admin: {
            description: 'Default priority for pages (0.0 to 1.0)',
            condition: (data) => data?.sitemapConfig?.enabled,
            step: 0.1,
          },
        },
      ],
    },
  ],
}
