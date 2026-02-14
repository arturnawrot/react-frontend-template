import type { GlobalConfig } from 'payload'

export const ScriptInjection: GlobalConfig = {
  slug: 'scriptInjection',
  label: 'Script Injection',
  admin: {
    description:
      'Add custom scripts, meta tags, and HTML to your site. Useful for analytics, tracking pixels, chat widgets, and other third-party integrations.',
    group: 'Site Settings',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Head Scripts',
          description: 'JavaScript that loads in the head',
          fields: [
            {
              name: 'headScripts',
              type: 'array',
              label: 'Head Scripts',
              admin: {
                description: 'Add scripts that should load in the head. For meta tags, use the "Head Tags" tab.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'A descriptive name (e.g., "Google Analytics", "Facebook Pixel")',
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enabled',
                  defaultValue: true,
                  admin: {
                    description: 'Toggle this script on/off without deleting it',
                  },
                },
                {
                  name: 'type',
                  type: 'select',
                  label: 'Script Type',
                  required: true,
                  defaultValue: 'external',
                  options: [
                    { label: 'External Script (URL)', value: 'external' },
                    { label: 'Inline JavaScript', value: 'inline' },
                  ],
                },
                {
                  name: 'src',
                  type: 'text',
                  label: 'Script URL',
                  admin: {
                    description: 'The URL of the external script file',
                    condition: (_, siblingData) => siblingData?.type === 'external',
                  },
                },
                {
                  name: 'code',
                  type: 'code',
                  label: 'JavaScript Code',
                  admin: {
                    language: 'javascript',
                    description:
                      'Paste your JavaScript code here (without <script> tags). Example: console.log("Hello");',
                    condition: (_, siblingData) => siblingData?.type === 'inline',
                  },
                },
                {
                  name: 'loadStrategy',
                  type: 'select',
                  label: 'Loading Strategy',
                  defaultValue: 'afterInteractive',
                  admin: {
                    description: 'When should this script load?',
                  },
                  options: [
                    {
                      label: 'Before Interactive (blocks page load - use sparingly)',
                      value: 'beforeInteractive',
                    },
                    {
                      label: 'After Interactive (recommended)',
                      value: 'afterInteractive',
                    },
                    {
                      label: 'Lazy (on browser idle)',
                      value: 'lazyOnload',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Head Tags',
          description: 'Meta tags, link tags, and other head elements',
          fields: [
            {
              name: 'headTags',
              type: 'array',
              label: 'Head Tags',
              admin: {
                description: 'Add meta tags, link tags, or other head elements.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'A descriptive name (e.g., "Open Graph Tags", "Favicon")',
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enabled',
                  defaultValue: true,
                },
                {
                  name: 'tagType',
                  type: 'select',
                  label: 'Tag Type',
                  required: true,
                  defaultValue: 'meta',
                  options: [
                    { label: 'Meta Tag', value: 'meta' },
                    { label: 'Link Tag', value: 'link' },
                    { label: 'Raw HTML', value: 'raw' },
                  ],
                },
                {
                  name: 'metaName',
                  type: 'text',
                  label: 'Meta Name/Property',
                  admin: {
                    description: 'The name or property attribute (e.g., "description", "og:title")',
                    condition: (_, siblingData) => siblingData?.tagType === 'meta',
                  },
                },
                {
                  name: 'metaContent',
                  type: 'text',
                  label: 'Meta Content',
                  admin: {
                    description: 'The content attribute value',
                    condition: (_, siblingData) => siblingData?.tagType === 'meta',
                  },
                },
                {
                  name: 'linkRel',
                  type: 'text',
                  label: 'Link Rel',
                  admin: {
                    description: 'The rel attribute (e.g., "stylesheet", "preconnect", "icon")',
                    condition: (_, siblingData) => siblingData?.tagType === 'link',
                  },
                },
                {
                  name: 'linkHref',
                  type: 'text',
                  label: 'Link Href',
                  admin: {
                    description: 'The href attribute (URL)',
                    condition: (_, siblingData) => siblingData?.tagType === 'link',
                  },
                },
                {
                  name: 'rawHtml',
                  type: 'code',
                  label: 'Raw HTML',
                  admin: {
                    language: 'html',
                    description:
                      'Paste raw HTML tags here (e.g., <style>...</style>). Note: Not all HTML is valid in head.',
                    condition: (_, siblingData) => siblingData?.tagType === 'raw',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Body Start',
          description: 'Content injected right after the opening <body> tag',
          fields: [
            {
              name: 'bodyStartScripts',
              type: 'array',
              label: 'Body Start Content',
              admin: {
                description:
                  'Scripts or HTML that load immediately after <body> opens. Common for noscript fallbacks.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'A descriptive name for this content',
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enabled',
                  defaultValue: true,
                },
                {
                  name: 'type',
                  type: 'select',
                  label: 'Content Type',
                  required: true,
                  defaultValue: 'inline',
                  options: [
                    { label: 'Raw HTML/Noscript', value: 'inline' },
                    { label: 'External Script (URL)', value: 'external' },
                  ],
                },
                {
                  name: 'code',
                  type: 'code',
                  label: 'HTML Code',
                  admin: {
                    language: 'html',
                    description:
                      'Paste your HTML here (e.g., <noscript>...</noscript>)',
                    condition: (_, siblingData) => siblingData?.type === 'inline',
                  },
                },
                {
                  name: 'src',
                  type: 'text',
                  label: 'Script URL',
                  admin: {
                    description: 'The URL of the external script file',
                    condition: (_, siblingData) => siblingData?.type === 'external',
                  },
                },
                {
                  name: 'loadStrategy',
                  type: 'select',
                  label: 'Loading Strategy',
                  defaultValue: 'afterInteractive',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'external',
                  },
                  options: [
                    {
                      label: 'Before Interactive',
                      value: 'beforeInteractive',
                    },
                    {
                      label: 'After Interactive (recommended)',
                      value: 'afterInteractive',
                    },
                    {
                      label: 'Lazy (on browser idle)',
                      value: 'lazyOnload',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Body End',
          description: 'Content injected before the closing </body> tag',
          fields: [
            {
              name: 'bodyEndScripts',
              type: 'array',
              label: 'Body End Content',
              admin: {
                description:
                  'Scripts or HTML at the end of the page. Best for non-critical scripts like chat widgets.',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'A descriptive name for this content',
                  },
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Enabled',
                  defaultValue: true,
                },
                {
                  name: 'type',
                  type: 'select',
                  label: 'Content Type',
                  required: true,
                  defaultValue: 'inline',
                  options: [
                    { label: 'Raw HTML', value: 'inline' },
                    { label: 'External Script (URL)', value: 'external' },
                  ],
                },
                {
                  name: 'code',
                  type: 'code',
                  label: 'HTML Code',
                  admin: {
                    language: 'html',
                    description: 'Paste your HTML or script tags here',
                    condition: (_, siblingData) => siblingData?.type === 'inline',
                  },
                },
                {
                  name: 'src',
                  type: 'text',
                  label: 'Script URL',
                  admin: {
                    description: 'The URL of the external script file',
                    condition: (_, siblingData) => siblingData?.type === 'external',
                  },
                },
                {
                  name: 'loadStrategy',
                  type: 'select',
                  label: 'Loading Strategy',
                  defaultValue: 'lazyOnload',
                  admin: {
                    condition: (_, siblingData) => siblingData?.type === 'external',
                  },
                  options: [
                    {
                      label: 'After Interactive',
                      value: 'afterInteractive',
                    },
                    {
                      label: 'Lazy (on browser idle - recommended)',
                      value: 'lazyOnload',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
