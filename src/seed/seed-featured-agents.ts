import type { Payload } from 'payload'

/**
 * Seeds the default featured agents set with random agents
 */
export async function seedFeaturedAgents(payload: Payload) {
  try {
    console.log('🌱 Seeding featured agents sets...')

    // Fetch all agents
    const agentsResult = await payload.find({
      collection: 'agents',
      limit: 1000,
      depth: 0,
    })

    const allAgents = agentsResult.docs
    console.log(`📊 Found ${allAgents.length} agents`)

    if (allAgents.length === 0) {
      console.log('⚠️  No agents found. Skipping featured agents seed.')
      return
    }

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'featuredAgentsSets',
    })

    // Shuffle and pick random agents (all agents)
    const shuffled = [...allAgents].sort(() => Math.random() - 0.5)
    const defaultSetAgentIds = shuffled.map((agent) => agent.id)

    console.log(`✅ Selected ${defaultSetAgentIds.length} random agents for default set`)

    // Prepare sets array
    let sets: Array<{ name: string; agentIds: string[] }> = []

    if (global?.sets) {
      // Parse if it's a string
      if (typeof global.sets === 'string') {
        try {
          sets = JSON.parse(global.sets)
        } catch (error) {
          console.error('Error parsing sets JSON:', error)
          sets = []
        }
      } else if (Array.isArray(global.sets)) {
        sets = global.sets as Array<{ name: string; agentIds: string[] }>
      }
    }

    // Check if default set already exists
    const defaultSetIndex = sets.findIndex((set) => set.name === 'default')

    if (defaultSetIndex >= 0) {
      // Update existing default set
      sets[defaultSetIndex] = {
        name: 'default',
        agentIds: defaultSetAgentIds,
      }
      console.log('🔄 Updated existing "default" set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          agentIds: defaultSetAgentIds,
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
    console.log(`   Default set contains ${defaultSetAgentIds.length} agents`)
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

