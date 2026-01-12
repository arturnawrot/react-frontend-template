import type { Payload } from 'payload'
import type { AgentCategory } from '@/payload-types'

/**
 * Seeds the AgentCategories global with categories and their associated agents
 */
export async function seedAgentCategories(payload: Payload) {
  try {
    console.log('🌱 Seeding agent categories...')

    // Helper function to find agent ID by slug
    async function findAgentIdBySlug(slug: string): Promise<string | null> {
      try {
        const result = await payload.find({
          collection: 'agents',
          where: {
            slug: {
              equals: slug,
            },
          },
          limit: 1,
          depth: 0,
        })

        if (result.docs.length > 0) {
          return result.docs[0].id
        }
        return null
      } catch (error) {
        console.warn(`⚠️  Error finding agent with slug "${slug}":`, error)
        return null
      }
    }

    // Category data from the provided JSON
    const categoryData = [
      {
        title: 'Land / Infill',
        backgroundColor: '#F1F6CA',
        linkType: 'none' as const,
        openInNewTab: false,
        agentSlugs: ['david-hogg', 'dean-newman', 'rebecca-wall-ccim'],
      },
      {
        title: 'Industrial / Flex',
        backgroundColor: '#E6EEA6',
        linkType: 'none' as const,
        openInNewTab: false,
        agentSlugs: ['david-hogg', 'mark-pritchett', 'danielle-meikrantz'],
      },
      {
        title: 'Retail / Strip Centers',
        backgroundColor: '#DAE684',
        linkType: 'none' as const,
        openInNewTab: false,
        agentSlugs: ['dean-newman', 'mark-pritchett', 'alex-hendry'],
      },
      {
        title: 'Office',
        backgroundColor: '#CEDD62',
        linkType: 'none' as const,
        openInNewTab: false,
        agentSlugs: ['bobby-meybohm', 'john-eckley-mba-civil-eng', 'alex-hendry'],
      },
      {
        title: 'Multi-Site Expansion',
        backgroundColor: '#C1D341',
        linkType: 'none' as const,
        openInNewTab: false,
        agentSlugs: ['jordan-collier', 'jonathan-aceves-ccim-mba', 'luke-henderson'],
      },
    ]

    // Find all agent IDs by slug
    console.log('📥 Finding agents by slug...')
    const categories: NonNullable<AgentCategory['categories']> = []

    for (const category of categoryData) {
      const agentIds: string[] = []

      for (const slug of category.agentSlugs) {
        const agentId = await findAgentIdBySlug(slug)
        if (agentId) {
          agentIds.push(agentId)
          console.log(`  ✅ Found agent: ${slug} (${agentId})`)
        } else {
          console.log(`  ⚠️  Agent not found: ${slug}`)
        }
      }

      if (agentIds.length === 3) {
        categories.push({
          title: category.title,
          backgroundColor: category.backgroundColor,
          linkType: category.linkType,
          openInNewTab: category.openInNewTab,
          agents: agentIds,
        })
        console.log(`  ✅ Created category: ${category.title} with ${agentIds.length} agents`)
      } else {
        console.log(
          `  ⚠️  Skipping category "${category.title}" - expected 3 agents, found ${agentIds.length}`
        )
      }
    }

    if (categories.length === 0) {
      console.log('⚠️  No valid categories created. Skipping agent categories seed.')
      return
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'agentCategories',
      data: {
        heading: 'Expertise That Moves Markets',
        description:
          'Our agents specialize in everything from raw land and infill redevelopment to national net-lease portfolios.',
        categories,
      },
    })

    console.log('✅ Agent categories seeded successfully!')
    console.log(`   Created ${categories.length} categories`)
    categories.forEach((cat) => {
      console.log(`   - ${cat.title} (${cat.agents.length} agents)`)
    })
  } catch (error) {
    console.error('❌ Error seeding agent categories:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-agent-categories.ts') ||
  process.argv[1]?.includes('seed-agent-categories')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedAgentCategories(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
