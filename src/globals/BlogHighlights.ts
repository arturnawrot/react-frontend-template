import type { GlobalConfig } from 'payload'

export const BlogHighlights: GlobalConfig = {
  slug: 'blogHighlights',
  admin: {
    description:
      'Configure the blog highlights page with featured posts, category explorer, and custom sections.',
  },
  access: {
    read: () => true,
  },
  fields: [
    // ============================================
    // SECTION 1: Top 4 Featured Posts
    // ============================================
    {
      name: 'featuredPosts',
      type: 'group',
      label: 'Featured Posts Section',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Featured Posts Section',
          defaultValue: true,
        },
        {
          name: 'posts',
          type: 'relationship',
          relationTo: 'blogs',
          hasMany: true,
          maxRows: 4,
          minRows: 0,
          admin: {
            description:
              'Select up to 4 posts. First post displays as featured (large), remaining 3 display in grid.',
          },
        },
      ],
    },

    // ============================================
    // SECTION 2: Explore by Category
    // ============================================
    {
      name: 'exploreByCategory',
      type: 'group',
      label: 'Explore by Category Section',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Explore by Category Section',
          defaultValue: true,
        },
        {
          name: 'heading',
          type: 'text',
          label: 'Section Heading',
          defaultValue: 'Explore by Category',
        },
        {
          name: 'displayedCategories',
          type: 'relationship',
          relationTo: 'blog-categories',
          hasMany: true,
          label: 'Quick Filter Categories',
          admin: {
            description:
              'Select categories to display as quick filter buttons. All categories remain available in dropdown.',
          },
        },
        {
          name: 'showTypeFilters',
          type: 'checkbox',
          label: 'Show Type Filter Buttons',
          defaultValue: true,
          admin: {
            description: 'Show Blog & Articles, Market Reports, Investment Spotlights, Client Stories as quick filters',
          },
        },
        {
          name: 'postsPerPage',
          type: 'number',
          label: 'Posts Per Page',
          defaultValue: 10,
          min: 4,
          max: 20,
        },
      ],
    },

    // ============================================
    // SECTION 3: Flexible Sections (repeatable)
    // ============================================
    {
      name: 'flexibleSections',
      type: 'array',
      label: 'Custom Sections',
      admin: {
        description: 'Add custom sections like "Client Stories" with manually selected or auto-populated articles.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Section Title',
          admin: {
            description: 'e.g., "Client Stories", "Investment Insights"',
          },
        },
        {
          name: 'viewAllLink',
          type: 'text',
          label: 'View All Link Text',
          defaultValue: 'Read More',
        },
        {
          name: 'selectionMode',
          type: 'select',
          required: true,
          defaultValue: 'manual',
          options: [
            {
              label: 'Manual Selection',
              value: 'manual',
            },
            {
              label: 'Newest from Category',
              value: 'category',
            },
            {
              label: 'Newest from Type',
              value: 'type',
            },
          ],
        },
        {
          name: 'manualArticles',
          type: 'relationship',
          relationTo: 'blogs',
          hasMany: true,
          admin: {
            condition: (_, siblingData) => siblingData?.selectionMode === 'manual',
            description: 'Manually select articles to display in this section',
          },
        },
        {
          name: 'categoryFilter',
          type: 'relationship',
          relationTo: 'blog-categories',
          admin: {
            condition: (_, siblingData) => siblingData?.selectionMode === 'category',
            description: 'Select a category to show newest articles from',
          },
        },
        {
          name: 'typeFilter',
          type: 'select',
          options: [
            { label: 'Article', value: 'article' },
            { label: 'Market Report', value: 'market-report' },
            { label: 'Investment Spotlight', value: 'investment-spotlight' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.selectionMode === 'type',
            description: 'Select a type to show newest articles from',
          },
        },
        {
          name: 'limit',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 6,
          admin: {
            condition: (_, siblingData) =>
              siblingData?.selectionMode === 'category' || siblingData?.selectionMode === 'type',
            description: 'Number of articles to display',
          },
        },
      ],
    },
  ],
}
