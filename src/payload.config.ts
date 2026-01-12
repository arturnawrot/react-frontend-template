
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
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
    },
  },
  collections: [Users, Media, Pages, CSSStyles, Agents, Roles, Specialties, ServingLocations, BlogCategories, Blogs, Jobs, JobApplications],
  globals: [Navbar, Footer, SiteSettings, FeaturedPropertiesSets, FeaturedAgentsSets, AgentIconsSets, FeaturedArticles, ProvenTrackRecordSets, TestimonialsSets, FAQSets],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [],
  endpoints: [seedEndpoint],
})
