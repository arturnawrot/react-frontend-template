import type { GlobalConfig } from 'payload'

export const SiteLock: GlobalConfig = {
  slug: 'siteLock',
  admin: {
    description: 'Password protect the entire site while allowing specific pages to be accessible',
    group: 'Settings',
  },
  access: {
    read: () => true, // Public read access needed to check lock status
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Enable Site Lock',
      defaultValue: false,
      admin: {
        description: 'When enabled, visitors must enter a password to access the site',
      },
    },
    {
      name: 'password',
      type: 'text',
      label: 'Site Password',
      required: true,
      admin: {
        description: 'The password required to access the locked site',
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'lockScreenTitle',
      type: 'text',
      label: 'Lock Screen Title',
      defaultValue: 'This site is password protected',
      admin: {
        description: 'Title displayed on the lock screen',
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'lockScreenMessage',
      type: 'textarea',
      label: 'Lock Screen Message',
      defaultValue: 'Please enter the password to continue.',
      admin: {
        description: 'Message displayed on the lock screen',
        condition: (data) => data?.enabled,
      },
    },
    {
      name: 'excludedPages',
      type: 'relationship',
      relationTo: 'pages',
      hasMany: true,
      label: 'Excluded Pages (Accessible Without Password)',
      admin: {
        description: 'Select pages that should be accessible without a password. All other pages will be locked.',
        condition: (data) => data?.enabled,
      },
    },
  ],
}
