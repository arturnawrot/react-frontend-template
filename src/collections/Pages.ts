import type { CollectionConfig } from 'payload'

import { Hero } from '../blocks/Hero'
import { FlippedM } from '../blocks/FlippedM'
import { Container } from '../blocks/Container'
import { CardSection } from '../blocks/CardSection'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true, // Public read access
  },
  fields: [
    {
      name: 'title',
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
        description: 'URL slug for this page (e.g., "home", "about")',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [Hero, FlippedM, Container, CardSection],
    },
  ],
  timestamps: true,
}

