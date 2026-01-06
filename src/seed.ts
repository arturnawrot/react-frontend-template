import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import { seedCSSStyles, seedNavbar, seedFooter } from './seed-utils'
import { seedHomePage } from './seed/seed-home'
import { seedBuyPage } from './seed/seed-buy'
import { seedBrokers } from './seed/seed-brokers'
import { seedFeaturedAgents } from './seed/seed-featured-agents'

async function seed() {
  const payload = await getPayload({ config })

  try {
    // Seed CSS styles (idempotent)
    console.log('Seeding CSS styles...')
    await seedCSSStyles(payload)

    // Seed Navbar (idempotent)
    await seedNavbar(payload)

    // Seed Footer (idempotent)
    await seedFooter(payload)

    // Seed all pages
    await seedHomePage(payload)
    await seedBuyPage(payload)

    // Seed all brokers from Buildout API (includes all agents)
    await seedBrokers(payload)

    // Seed featured agents sets (creates default set with 6 random agents)
    await seedFeaturedAgents(payload)

    console.log('✅ All pages seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seed()

