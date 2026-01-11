import type { Payload } from 'payload'
import { slugify } from '../utils/slugify'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { tmpdir } from 'os'

/**
 * Creates or finds a blog category and returns its ID
 */
async function getOrCreateBlogCategory(
  payload: Payload,
  categoryName: string
): Promise<string | null> {
  if (!categoryName || !categoryName.trim()) {
    return null
  }

  const name = categoryName.trim()

  // Try to find existing category
  const existing = await payload.find({
    collection: 'blog-categories',
    where: {
      name: {
        equals: name,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }

  // Create new category
  try {
    const created = await payload.create({
      collection: 'blog-categories',
      data: {
        name,
        slug: slugify(name),
      },
      draft: false,
    })
    return created.id
  } catch (error) {
    console.error(`❌ Error creating blog category "${name}":`, error)
    return null
  }
}

/**
 * Gets a random user ID for author
 */
async function getRandomUser(payload: Payload): Promise<string | null> {
  try {
    const users = await payload.find({
      collection: 'users',
      limit: 100,
    })

    if (users.docs.length === 0) {
      console.error('❌ No users found. Please create at least one user first.')
      return null
    }

    const randomUser = users.docs[Math.floor(Math.random() * users.docs.length)]
    return randomUser.id
  } catch (error) {
    console.error('❌ Error getting random user:', error)
    return null
  }
}

/**
 * Downloads an image from a URL and saves it to a temporary file
 */
async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  await writeFile(filepath, Buffer.from(buffer))
}

/**
 * Creates a unique seed from a title
 */
function createUniqueSeed(title: string, type: string, index: number): string {
  // Create a hash-like seed from the title
  const titleHash = title
    .split('')
    .reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0)
    }, 0)
    .toString(36)
  
  return `${type}-${index}-${titleHash}`
}

/**
 * Uploads an image from picsum.photos to Payload media collection
 * Returns the media ID or null if upload fails
 */
async function uploadImageFromPicsum(
  payload: Payload,
  seed: string,
  altText: string,
  filename: string
): Promise<string | null> {
  try {
    // Check if image already exists by seed (not filename, since we want unique images)
    // We'll use the seed in the filename to make it unique
    const existingImage = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    })

    if (existingImage.docs.length > 0) {
      return existingImage.docs[0].id
    }

    // Use picsum.photos with seed for consistent images
    // Using 1200x800 for high-quality blog featured images
    const imageUrl = `https://picsum.photos/seed/${seed}/1200/800`

    // Create temp directory if it doesn't exist
    const tempDir = join(tmpdir(), 'payload-seed')
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true })
    }

    // Download image to temp file
    const tempFilePath = join(tempDir, filename)
    await downloadImage(imageUrl, tempFilePath)

    // Upload to Payload
    const uploadedImage = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      filePath: tempFilePath,
    })

    // Clean up temp file
    try {
      await unlink(tempFilePath)
    } catch (error) {
      // Ignore cleanup errors
      console.warn(`⚠️  Could not delete temp file ${tempFilePath}:`, error)
    }

    return uploadedImage.id
  } catch (error) {
    console.error(`❌ Error uploading image from picsum.photos:`, error)
    return null
  }
}

/**
 * Creates a simple Lexical content structure
 */
function createLexicalContent(text: string) {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: text,
              type: 'text',
              version: 1,
            },
          ],
          direction: null,
          format: '' as '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify',
          indent: 0,
          type: 'paragraph',
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: null,
      format: '' as '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

/**
 * Article titles and descriptions by type
 */
const articleTitles = [
  'Understanding Commercial Real Estate Trends in 2025',
  'The Future of Office Spaces Post-Pandemic',
  'Retail Real Estate: Adapting to E-Commerce',
  'Industrial Real Estate: The Logistics Boom',
  'Sustainable Building Practices in Commercial Real Estate',
  'Navigating Zoning Laws for Commercial Properties',
  'The Impact of Interest Rates on Commercial Real Estate',
  'Technology Integration in Modern Office Buildings',
  'Mixed-Use Developments: The New Urban Standard',
  'Commercial Real Estate Investment Strategies for Beginners',
]

const marketReportTitles = [
  'Q1 2025 Augusta Commercial Real Estate Market Report',
  'Columbia SC Market Analysis: Retail Sector Growth',
  'Aiken County Industrial Market Trends 2025',
  'Augusta Office Market: Vacancy Rates and Absorption',
  'Southeast Georgia Commercial Real Estate Outlook',
  'Multi-Family Housing Market Report: Augusta Region',
  'Retail Market Performance: Q1 2025 Analysis',
  'Industrial Warehouse Demand in the CSRA',
  'Medical Office Space Market Trends',
  'Hospitality Real Estate Market: Post-Pandemic Recovery',
]

const investmentSpotlightTitles = [
  'Medical Office Complex Acquisition: Columbia, SC',
  'Retail Strip Center Investment: Augusta, GA',
  'Industrial Warehouse Portfolio: Aiken County',
  'Multi-Tenant Office Building: Downtown Augusta',
  'Medical Office Building: 1031 Exchange Success',
  'Retail Development: New Shopping Center',
  'Industrial Facility: Long-Term Lease Investment',
  'Office Complex: Value-Add Opportunity',
  'Medical Office: Off-Market Transaction',
  'Retail Property: Quick Close Investment',
]

const descriptions = [
  'An in-depth analysis of current market conditions and future projections.',
  'Exploring the latest trends and opportunities in commercial real estate.',
  'A comprehensive guide to understanding market dynamics and investment strategies.',
  'Key insights into property values, rental rates, and market performance.',
  'Expert analysis of emerging trends and their impact on commercial real estate.',
  'Understanding the factors driving market growth and investment opportunities.',
  'A detailed examination of market conditions and investment potential.',
  'Strategic insights for investors and property owners in today\'s market.',
  'Market analysis and projections for the coming year.',
  'Expert perspectives on market trends and investment opportunities.',
]

const propertyTypes = [
  'Medical Office',
  'Retail Strip Center',
  'Industrial Warehouse',
  'Office Building',
  'Multi-Tenant Office',
  'Retail Development',
  'Industrial Facility',
  'Medical Complex',
  'Office Complex',
  'Retail Property',
]

const sizes = [
  '18,000 SF (3 Buildings)',
  '25,000 SF',
  '45,000 SF',
  '12,500 SF',
  '30,000 SF (2 Buildings)',
  '15,000 SF',
  '50,000 SF',
  '22,000 SF',
  '35,000 SF',
  '20,000 SF',
]

const markets = [
  'Columbia, SC',
  'Augusta, GA',
  'Aiken, SC',
  'North Augusta, SC',
  'Evans, GA',
  'Martinez, GA',
  'Grovetown, GA',
  'Harlem, GA',
  'Waynesboro, GA',
  'Thomson, GA',
]

const buyerTypes = [
  '1031 Investor (Out of State)',
  'Local Investor',
  '1031 Exchange Buyer',
  'Institutional Investor',
  'Private Equity Group',
  'Family Office',
  'High Net Worth Individual',
  'Real Estate Investment Trust',
  'Developer',
  'Owner-User',
]

const closeTimes = [
  '37 days',
  '45 days',
  '30 days',
  '60 days',
  '42 days',
  '35 days',
  '50 days',
  '28 days',
  '55 days',
  '40 days',
]

const statuses = [
  'Closed Off-Market',
  'Closed',
  'Pending',
  'Under Contract',
  'Closed - 1031 Exchange',
  'Closed - All Cash',
  'Closed - Traditional Financing',
]

const categories = [
  'Retail',
  'Office',
  'Industrial',
  'Medical',
  'Investment',
  'Market Analysis',
  'Leasing',
  'Development',
]

/**
 * Seeds articles (blogs) with 10 of each type
 */
export async function seedArticles(payload: Payload) {
  try {
    console.log('🌱 Starting articles seed...')

    // Get or create required resources
    console.log('📋 Setting up resources...')
    const authorId = await getRandomUser(payload)
    if (!authorId) {
      throw new Error('No users found. Please create at least one user first.')
    }
    console.log(`✅ Using author: ${authorId}`)
    console.log(`✅ Will use picsum.photos for article images`)

    // Get or create categories
    const categoryIds: string[] = []
    for (const categoryName of categories) {
      const categoryId = await getOrCreateBlogCategory(payload, categoryName)
      if (categoryId) {
        categoryIds.push(categoryId)
      }
    }
    console.log(`✅ Created/found ${categoryIds.length} categories`)

    if (categoryIds.length === 0) {
      throw new Error('No categories available. Please create at least one blog category.')
    }

    let created = 0
    let skipped = 0
    let errors = 0

    // Seed Articles (type: article)
    console.log('\n📝 Seeding Articles (type: article)...')
    for (let i = 0; i < 10; i++) {
      try {
        const title = articleTitles[i]
        const description = descriptions[Math.floor(Math.random() * descriptions.length)]
        const randomCategories = [
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
        ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

        // Check if article already exists
        const existing = await payload.find({
          collection: 'blogs',
          where: {
            title: {
              equals: title,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`  ⏭️  Skipping "${title}" - already exists`)
          skipped++
          continue
        }

        // Get unique image from picsum.photos for this article
        // Use title-based seed to ensure each article gets a unique image
        const imageSeed = createUniqueSeed(title, 'article', i)
        const imageFilename = `article-${slugify(title)}-${i}.jpg`
        const featuredImageId = await uploadImageFromPicsum(
          payload,
          imageSeed,
          title,
          imageFilename
        )

        const articleData: any = {
          type: 'article',
          title,
          description,
          featuredImage: featuredImageId,
          author: authorId,
          categories: randomCategories,
          content: createLexicalContent(
            `This is a comprehensive article about ${title.toLowerCase()}. ${description} The content provides valuable insights and analysis for commercial real estate professionals and investors.`
          ),
        }

        await payload.create({
          collection: 'blogs',
          data: articleData,
        })

        created++
        console.log(`  ✅ Created: "${title}"`)
      } catch (error) {
        console.error(`  ❌ Error creating article ${i + 1}:`, error)
        errors++
      }
    }

    // Seed Market Reports (type: market-report)
    console.log('\n📊 Seeding Market Reports (type: market-report)...')
    for (let i = 0; i < 10; i++) {
      try {
        const title = marketReportTitles[i]
        const description = descriptions[Math.floor(Math.random() * descriptions.length)]
        const randomCategories = [
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
        ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

        // Check if article already exists
        const existing = await payload.find({
          collection: 'blogs',
          where: {
            title: {
              equals: title,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`  ⏭️  Skipping "${title}" - already exists`)
          skipped++
          continue
        }

        // Get unique image from picsum.photos for this market report
        // Use title-based seed to ensure each report gets a unique image
        const imageSeed = createUniqueSeed(title, 'market-report', i)
        const imageFilename = `market-report-${slugify(title)}-${i}.jpg`
        const featuredImageId = await uploadImageFromPicsum(
          payload,
          imageSeed,
          title,
          imageFilename
        )

        const articleData: any = {
          type: 'market-report',
          title,
          description,
          featuredImage: featuredImageId,
          author: authorId,
          categories: randomCategories,
          content: createLexicalContent(
            `This market report provides detailed analysis of ${title.toLowerCase()}. ${description} The report includes market data, trends, and projections for the commercial real estate sector.`
          ),
        }

        await payload.create({
          collection: 'blogs',
          data: articleData,
        })

        created++
        console.log(`  ✅ Created: "${title}"`)
      } catch (error) {
        console.error(`  ❌ Error creating market report ${i + 1}:`, error)
        errors++
      }
    }

    // Seed Investment Spotlights (type: investment-spotlight)
    console.log('\n💼 Seeding Investment Spotlights (type: investment-spotlight)...')
    for (let i = 0; i < 10; i++) {
      try {
        const title = investmentSpotlightTitles[i]
        const description = descriptions[Math.floor(Math.random() * descriptions.length)]
        const randomCategories = [
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
          categoryIds[Math.floor(Math.random() * categoryIds.length)],
        ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

        // Check if article already exists
        const existing = await payload.find({
          collection: 'blogs',
          where: {
            title: {
              equals: title,
            },
          },
          limit: 1,
        })

        if (existing.docs.length > 0) {
          console.log(`  ⏭️  Skipping "${title}" - already exists`)
          skipped++
          continue
        }

        // Get unique image from picsum.photos for this investment spotlight
        // Use title-based seed to ensure each spotlight gets a unique image
        const imageSeed = createUniqueSeed(title, 'investment-spotlight', i)
        const imageFilename = `investment-spotlight-${slugify(title)}-${i}.jpg`
        const featuredImageId = await uploadImageFromPicsum(
          payload,
          imageSeed,
          title,
          imageFilename
        )

        const articleData: any = {
          type: 'investment-spotlight',
          title,
          description,
          featuredImage: featuredImageId,
          author: authorId,
          categories: randomCategories,
          content: createLexicalContent(
            `This investment spotlight highlights ${title.toLowerCase()}. ${description} The property represents an excellent investment opportunity with strong fundamentals and growth potential.`
          ),
          // Investment Spotlight specific fields
          propertyType: propertyTypes[Math.floor(Math.random() * propertyTypes.length)],
          size: sizes[Math.floor(Math.random() * sizes.length)],
          market: markets[Math.floor(Math.random() * markets.length)],
          buyerType: buyerTypes[Math.floor(Math.random() * buyerTypes.length)],
          closeTime: closeTimes[Math.floor(Math.random() * closeTimes.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
        }

        await payload.create({
          collection: 'blogs',
          data: articleData,
        })

        created++
        console.log(`  ✅ Created: "${title}"`)
      } catch (error) {
        console.error(`  ❌ Error creating investment spotlight ${i + 1}:`, error)
        errors++
      }
    }

    console.log(`\n✅ Articles seed completed!`)
    console.log(`   Created: ${created}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Errors: ${errors}`)
  } catch (error) {
    console.error('❌ Error seeding articles:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:articles
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-articles.ts') ||
  process.argv[1]?.includes('seed-articles')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedArticles(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
