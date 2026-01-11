import type { Payload } from 'payload'
import { buildoutApi } from '../utils/buildout-api'

/**
 * Seeds the default featured properties set with 4 random properties from buildout-api
 */
export async function seedFeaturedProperties(payload: Payload) {
  try {
    console.log('🌱 Seeding featured properties sets...')

    // Fetch all properties from buildout-api
    console.log('📥 Fetching properties from Buildout API...')
    const propertiesResponse = await buildoutApi.getAllProperties({ skipCache: false })
    const properties = propertiesResponse.properties

    console.log(`📊 Found ${properties.length} properties from Buildout API`)

    if (properties.length === 0) {
      console.log('⚠️  No properties found from Buildout API. Skipping featured properties seed.')
      return
    }

    // Filter properties with valid IDs
    const validProperties = properties.filter((p) => p.id && typeof p.id === 'number')

    if (validProperties.length === 0) {
      console.log('⚠️  No valid properties found. Skipping featured properties seed.')
      return
    }

    // Shuffle and pick 4 random properties
    const shuffled = [...validProperties].sort(() => Math.random() - 0.5)
    const selectedProperties = shuffled.slice(0, Math.min(4, shuffled.length))
    const propertyIds = selectedProperties.map((p) => p.id).filter((id): id is number => typeof id === 'number')

    console.log(`✅ Selected ${propertyIds.length} random properties for default set`)

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'featuredPropertiesSets',
    })

    // Prepare sets array - sets is now an array field, propertyIds is JSON
    let sets: Array<{ name: string; propertyIds: number[] }> = []

    if (global?.sets && Array.isArray(global.sets)) {
      sets = global.sets.map((set: any) => {
        let propertyIds: number[] = []
        if (set.propertyIds) {
          if (Array.isArray(set.propertyIds)) {
            propertyIds = set.propertyIds.filter((id: any): id is number => typeof id === 'number')
          } else if (typeof set.propertyIds === 'string') {
            try {
              const parsed = JSON.parse(set.propertyIds)
              if (Array.isArray(parsed)) {
                propertyIds = parsed.filter((id: any): id is number => typeof id === 'number')
              }
            } catch (e) {
              console.error('Error parsing propertyIds JSON:', e)
            }
          }
        }
        return {
          name: set.name,
          propertyIds
        }
      })
    }

    // Check if default set already exists
    const defaultSetIndex = sets.findIndex((set) => set.name === 'default')

    if (defaultSetIndex >= 0) {
      // Update existing default set
      sets[defaultSetIndex] = {
        name: 'default',
        propertyIds,
      }
      console.log('🔄 Updated existing "default" set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          propertyIds,
        },
        ...sets, // Add any existing sets after default
      ]
      console.log('➕ Created new "default" set')
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'featuredPropertiesSets',
      data: {
        sets,
      },
    })

    console.log('✅ Featured properties sets seeded successfully!')
    console.log(`   Default set contains ${propertyIds.length} properties`)
  } catch (error) {
    console.error('❌ Error seeding featured properties sets:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-featured-properties.ts') ||
  process.argv[1]?.includes('seed-featured-properties')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedFeaturedProperties(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
