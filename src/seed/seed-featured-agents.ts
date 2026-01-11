import type { Payload } from 'payload'
import { buildoutApi } from '../utils/buildout-api'

/**
 * Seeds the default featured agents set with 10 random agents from buildout-api
 */
export async function seedFeaturedAgents(payload: Payload) {
  try {
    console.log('🌱 Seeding featured agents sets...')

    // Fetch all brokers from buildout-api
    console.log('📥 Fetching brokers from Buildout API...')
    const brokersResponse = await buildoutApi.getAllBrokers({ skipCache: false })
    const brokers = brokersResponse.brokers

    console.log(`📊 Found ${brokers.length} brokers from Buildout API`)

    if (brokers.length === 0) {
      console.log('⚠️  No brokers found from Buildout API. Skipping featured agents seed.')
      return
    }

    // Shuffle and pick 10 random brokers
    const shuffled = [...brokers].sort(() => Math.random() - 0.5)
    const selectedBrokers = shuffled.slice(0, Math.min(10, shuffled.length))

    console.log(`✅ Selected ${selectedBrokers.length} random brokers from Buildout API`)

    // Find matching agents in Payload by buildout_broker_id
    const agentIds: string[] = []
    for (const broker of selectedBrokers) {
      const agent = await payload.find({
        collection: 'agents',
        where: {
          buildout_broker_id: {
            equals: String(broker.id),
          },
        },
        limit: 1,
        depth: 0,
      })

      if (agent.docs.length > 0) {
        agentIds.push(agent.docs[0].id)
      } else {
        console.log(`⚠️  Agent not found in Payload for broker ID ${broker.id}`)
      }
    }

    if (agentIds.length === 0) {
      console.log('⚠️  No matching agents found in Payload. Skipping featured agents seed.')
      return
    }

    console.log(`✅ Found ${agentIds.length} matching agents in Payload`)

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'featuredAgentsSets',
    })

    // Prepare sets array - sets is now an array field, agents is a relationship field
    let sets: Array<{ name: string; agents: string[] }> = []

    if (global?.sets && Array.isArray(global.sets)) {
      sets = global.sets.map((set: any) => ({
        name: set.name,
        // Convert agents relationship to array of IDs
        agents: Array.isArray(set.agents) 
          ? set.agents.map((a: any) => typeof a === 'string' ? a : a.id).filter(Boolean)
          : []
      }))
    }

    // Check if default set already exists
    const defaultSetIndex = sets.findIndex((set) => set.name === 'default')

    if (defaultSetIndex >= 0) {
      // Update existing default set
      sets[defaultSetIndex] = {
        name: 'default',
        agents: agentIds, // Relationship field expects array of agent IDs
      }
      console.log('🔄 Updated existing "default" set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          agents: agentIds, // Relationship field expects array of agent IDs
        },
        ...sets, // Add any existing sets after default
      ]
      console.log('➕ Created new "default" set')
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'featuredAgentsSets',
      data: {
        sets,
      },
    })

    console.log('✅ Featured agents sets seeded successfully!')
    console.log(`   Default set contains ${agentIds.length} agents`)
  } catch (error) {
    console.error('❌ Error seeding featured agents sets:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-featured-agents.ts') ||
  process.argv[1]?.includes('seed-featured-agents')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedFeaturedAgents(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}

