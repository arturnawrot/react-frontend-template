import type { Payload } from 'payload'

/**
 * Seeds the default featured articles set with max 10 random articles from blogs collection
 */
export async function seedFeaturedArticles(payload: Payload) {
  try {
    console.log('🌱 Seeding featured articles sets...')

    // Fetch all articles from blogs collection
    const articlesResult = await payload.find({
      collection: 'blogs',
      limit: 1000,
      depth: 0,
    })

    const allArticles = articlesResult.docs
    console.log(`📊 Found ${allArticles.length} articles`)

    if (allArticles.length === 0) {
      console.log('⚠️  No articles found. Skipping featured articles seed.')
      return
    }

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'featuredArticles',
    })

    // Shuffle and pick max 10 random articles
    const shuffled = [...allArticles].sort(() => Math.random() - 0.5)
    const selectedArticles = shuffled.slice(0, Math.min(10, shuffled.length))
    const defaultSetArticleIds = selectedArticles.map((article) => article.id)

    console.log(`✅ Selected ${defaultSetArticleIds.length} random articles for default set`)

    // Prepare sets array
    let sets: Array<{ name: string; articles: string[] }> = []

    if (global?.sets && Array.isArray(global.sets)) {
      sets = global.sets.map((set: any) => ({
        name: set.name,
        articles: Array.isArray(set.articles)
          ? set.articles.map((a: any) => (typeof a === 'string' ? a : a.id))
          : [],
      }))
    }

    // Check if default set already exists
    const defaultSetIndex = sets.findIndex((set) => set.name === 'default')

    if (defaultSetIndex >= 0) {
      // Update existing default set
      sets[defaultSetIndex] = {
        name: 'default',
        articles: defaultSetArticleIds,
      }
      console.log('🔄 Updated existing "default" set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          articles: defaultSetArticleIds,
        },
        ...sets, // Add any existing sets after default
      ]
      console.log('➕ Created new "default" set')
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'featuredArticles',
      data: {
        sets,
      },
    })

    console.log('✅ Featured articles sets seeded successfully!')
    console.log(`   Default set contains ${defaultSetArticleIds.length} articles`)
  } catch (error) {
    console.error('❌ Error seeding featured articles sets:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-featured-articles.ts') ||
  process.argv[1]?.includes('seed-featured-articles')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedFeaturedArticles(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
