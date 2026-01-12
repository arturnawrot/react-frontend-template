import type { Payload } from 'payload'
import { seedCSSStyles, seedNavbar, seedFooter } from '@/seed/seed-utils'
import { seedHomePage } from '@/seed/seed-home'
import { seedBuyPage } from '@/seed/seed-buy'
import { seedBuyerRepresentationPage } from '@/seed/seed-buyer-representation'
import { seed1031ExchangeSupportPage } from '@/seed/seed-1031-exchange-support'
import { seedOurServicesPage } from '@/seed/seed-our-services'
import { seedOurAdvantagePage } from '@/seed/seed-our-advantage'
import { seedOurAgentsPage } from '@/seed/seed-our-agents'
import { seedLeasePage } from '@/seed/seed-lease'
import { seedSellPage } from '@/seed/seed-sell'
import { seedBrokers } from '@/seed/seed-brokers'
import { seedFeaturedAgents } from '@/seed/seed-featured-agents'
import { seedArticles } from '@/seed/seed-articles'
import { seedFeaturedArticles } from '@/seed/seed-featured-articles'
import { seedFeaturedProperties } from '@/seed/seed-featured-properties'
import { seedProvenTrackRecord } from '@/seed/seed-proven-track-record'
import { seedTestimonials } from '@/seed/seed-testimonials'
import { seedFAQSets } from '@/seed/seed-faq-sets'
import { seedAgentCategories } from '@/seed/seed-agent-categories'

/**
 * Main seed function that runs all seed operations
 * Can be used by both CLI scripts and API endpoints
 * 
 * Order is important due to dependencies:
 * 1. Base data (CSS, Navbar, Footer, Pages) - no dependencies
 * 2. Core collections (Brokers/Agents, Articles) - must run first
 * 3. Featured sets (depend on core collections existing)
 */
export async function runSeed(payload: Payload) {
  // ============================================
  // Phase 1: Base Configuration (no dependencies)
  // ============================================
  console.log('\n📋 Phase 1: Seeding base configuration...')
  
  // Seed CSS styles (idempotent)
  console.log('  Seeding CSS styles...')
  await seedCSSStyles(payload)

  // Seed Footer (idempotent)
  console.log('  Seeding Footer...')
  await seedFooter(payload)

  // Seed FAQ sets (no dependencies)
  // Creates default set with sample FAQs
  console.log('  Seeding FAQ sets...')
  await seedFAQSets(payload)

  // Seed all pages
  console.log('  Seeding pages...')
  await seedHomePage(payload)
  await seedBuyPage(payload)
  await seedBuyerRepresentationPage(payload)
  await seed1031ExchangeSupportPage(payload)
  await seedOurServicesPage(payload)
  await seedOurAdvantagePage(payload)
  await seedOurAgentsPage(payload)
  await seedLeasePage(payload)
  await seedSellPage(payload)

  // Seed Navbar (idempotent) - must run after pages since it references them
  console.log('  Seeding Navbar...')
  await seedNavbar(payload)

  // ============================================
  // Phase 2: Core Collections (must run first)
  // ============================================
  console.log('\n👥 Phase 2: Seeding core collections...')
  
  // Seed all brokers from Buildout API (creates agents collection)
  // MUST run before featured agents and proven track record
  console.log('  Seeding brokers/agents from Buildout API...')
  await seedBrokers(payload)

  // Seed articles (10 of each type: article, market-report, investment-spotlight)
  // MUST run before featured articles
  console.log('  Seeding articles...')
  await seedArticles(payload)

  // ============================================
  // Phase 3: Featured Sets (depend on core collections)
  // ============================================
  console.log('\n⭐ Phase 3: Seeding featured sets...')
  
  // Seed featured articles sets (depends on articles existing)
  // Creates default set with all articles
  console.log('  Seeding featured articles sets...')
  await seedFeaturedArticles(payload)

  // Seed featured agents sets (depends on agents existing)
  // Creates default set with 10 random agents from buildout-api
  console.log('  Seeding featured agents sets...')
  await seedFeaturedAgents(payload)

  // Seed agent categories (depends on agents existing)
  // Creates categories with associated agents
  console.log('  Seeding agent categories...')
  await seedAgentCategories(payload)

  // Seed featured properties sets (no Payload dependencies, uses buildout-api)
  // Creates default set with 4 random properties from buildout-api
  console.log('  Seeding featured properties sets...')
  await seedFeaturedProperties(payload)

  // Seed proven track record sets (depends on agents existing)
  // Creates default set with properties from buildout-api, matched with agents
  console.log('  Seeding proven track record sets...')
  await seedProvenTrackRecord(payload)

  // Seed testimonials sets (no dependencies)
  // Creates default set with sample testimonials
  console.log('  Seeding testimonials sets...')
  await seedTestimonials(payload)

  console.log('\n✅ All seed operations completed successfully!')
}
