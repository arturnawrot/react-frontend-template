
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import importExportPlugin from 'payload-plugin-import-export'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { PageSEO } from './collections/PageSEO'
import { CSSStyles } from './collections/CSSStyles'
import { Agents } from './collections/Agents'
import { Roles } from './collections/Roles'
import { Specialties } from './collections/Specialties'
import { ServingLocations } from './collections/ServingLocations'
import { BlogCategories } from './collections/BlogCategories'
import { Blogs } from './collections/Blogs'
import { Jobs } from './collections/Jobs'
import { JobApplications } from './collections/JobApplications'
import { Navbar } from './globals/Navbar'
import { Footer } from './globals/Footer'
import { SiteSettings } from './globals/SiteSettings'
import { FeaturedPropertiesSets } from './globals/FeaturedPropertiesSets'
import { FeaturedAgentsSets } from './globals/FeaturedAgentsSets'
import { AgentIconsSets } from './globals/AgentIconsSets'
import { FeaturedArticles } from './globals/FeaturedArticles'
import { ProvenTrackRecordSets } from './globals/ProvenTrackRecordSets'
import { TestimonialsSets } from './globals/TestimonialsSets'
import { FAQSets } from './globals/FAQSets'
import { FAQFullPage } from './globals/FAQFullPage'
import { AgentCategories } from './globals/AgentCategories'
import { BlogHighlights } from './globals/BlogHighlights'
import { AvailableJobSets } from './globals/AvailableJobSets'
import { OfficeLocationSets } from './globals/OfficeLocationSets'
import { seedEndpoint } from './endpoints/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      afterNavLinks: ['/components/ClearBuildoutCache'],
      graphics: {
        Logo: '/components/Logo/LogoDark',
        Icon: '/components/Logo/Icon',
      },
    },
    meta: {
      titleSuffix: 'Real Estate CMS',
      icons: [{ url: '/favicon.ico' }],
    },
  },
  collections: [Users, Media, Pages, PageSEO, CSSStyles, Agents, Roles, Specialties, ServingLocations, BlogCategories, Blogs, Jobs, JobApplications],
  globals: [Navbar, Footer, SiteSettings, FeaturedPropertiesSets, FeaturedAgentsSets, AgentIconsSets, FeaturedArticles, ProvenTrackRecordSets, TestimonialsSets, FAQSets, FAQFullPage, AgentCategories, BlogHighlights, AvailableJobSets, OfficeLocationSets],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    importExportPlugin({
      enabled: true,
      excludeCollections: ['users'],
    }),
  ],
  endpoints: [seedEndpoint],
})
