import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import { seedCSSStyles, seedNavbar } from './seed-utils'
import { seedHomePage } from './seed/seed-home'
import { seedBuyPage } from './seed/seed-buy'
import { seedJordanCollier } from './seed/seed-jordan-collier'

async function seed() {
  const payload = await getPayload({ config })

  try {
    // Seed CSS styles (idempotent)
    console.log('Seeding CSS styles...')
    await seedCSSStyles(payload)

    // Seed Navbar (idempotent)
    await seedNavbar(payload)

    // Seed all pages
    await seedHomePage(payload)
    await seedBuyPage(payload)

    // Seed agents
    await seedJordanCollier(payload)

    console.log('✅ All pages seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seed()

