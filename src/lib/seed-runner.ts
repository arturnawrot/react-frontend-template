import type { Payload } from 'payload'
import { seedCSSStyles, seedNavbar, seedFooter } from '@/seed/seed-utils'
import { seedHomePage } from '@/seed/seed-home'
import { seedBuyPage } from '@/seed/seed-buy'
import { seedBrokers } from '@/seed/seed-brokers'
import { seedFeaturedAgents } from '@/seed/seed-featured-agents'
import { seedArticles } from '@/seed/seed-articles'

/**
 * Main seed function that runs all seed operations
 * Can be used by both CLI scripts and API endpoints
 */
export async function runSeed(payload: Payload) {
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

  // Seed articles (10 of each type: article, market-report, investment-spotlight)
  await seedArticles(payload)

  console.log('✅ All pages seeded successfully!')
}
