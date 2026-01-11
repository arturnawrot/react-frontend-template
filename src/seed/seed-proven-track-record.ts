import type { Payload } from 'payload'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { tmpdir } from 'os'

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
 * Uploads an image from a URL to Payload media collection
 * Returns the media ID or null if upload fails
 */
async function uploadImageFromUrl(
  payload: Payload,
  imageUrl: string,
  altText: string,
  filename: string
): Promise<string | null> {
  try {
    // Check if image already exists
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
    console.error(`❌ Error uploading image ${imageUrl}:`, error)
    return null
  }
}

/**
 * Gets a random agent ID from Payload (optional)
 */
async function getRandomAgent(payload: Payload): Promise<string | undefined> {
  try {
    const agents = await payload.find({
      collection: 'agents',
      limit: 100,
      depth: 0,
    })

    if (agents.docs.length === 0) {
      return undefined
    }

    const randomAgent = agents.docs[Math.floor(Math.random() * agents.docs.length)]
    return randomAgent.id
  } catch (error) {
    console.warn('⚠️  Could not fetch agents:', error)
    return undefined
  }
}

/**
 * Seeds the default proven track record set with 10 placeholder items
 * Some items have title only, some have full details
 */
export async function seedProvenTrackRecord(payload: Payload) {
  try {
    console.log('🌱 Seeding proven track record sets...')

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'provenTrackRecordSets',
    })

    // Prepare sets array
    let sets: Array<{
      name: string
      items: Array<{
        image: string
        title: string
        address?: string
        price?: string
        size?: string
        propertyType?: string
        agent?: string
        link?: string
      }>
    }> = []

    if (global?.sets && Array.isArray(global.sets)) {
      sets = global.sets.map((set: any) => ({
        name: set.name,
        items: Array.isArray(set.items) ? set.items : [],
      }))
    }

    // Sample data for track record items
    const trackRecordData = [
      // Items with title only (5 items)
      { title: 'Commercial Office Space', titleOnly: true },
      { title: 'Retail Development Project', titleOnly: true },
      { title: 'Industrial Warehouse Sale', titleOnly: true },
      { title: 'Mixed-Use Property Development', titleOnly: true },
      { title: 'Medical Office Building', titleOnly: true },
      
      // Items with full details (5 items)
      {
        title: 'Downtown Office Complex',
        address: '123 Main Street, Atlanta, GA 30309',
        price: '$2,500,000',
        size: '15,000 SF',
        propertyType: 'Office Space',
        link: '/property/1',
      },
      {
        title: 'Retail Shopping Center',
        address: '456 Commerce Blvd, Savannah, GA 31401',
        price: '$4,200,000',
        size: '25,000 SF',
        propertyType: 'Retail',
        link: '/property/2',
      },
      {
        title: 'Industrial Distribution Facility',
        address: '789 Industrial Way, Augusta, GA 30901',
        price: '$6,800,000',
        size: '45,000 SF',
        propertyType: 'Industrial',
        link: '/property/3',
      },
      {
        title: 'Medical Office Building',
        address: '321 Healthcare Drive, Macon, GA 31201',
        price: '$3,500,000',
        size: '18,500 SF',
        propertyType: 'Medical',
        link: '/property/4',
      },
      {
        title: 'Multi-Tenant Office Building',
        address: '654 Business Park, Columbus, GA 31901',
        price: '$5,100,000',
        size: '32,000 SF',
        propertyType: 'Office Space',
        link: '/property/5',
      },
    ]

    // Get a random agent (optional, will be used for items with full details)
    const randomAgentId = await getRandomAgent(payload)

    // Create items for the default set
    const items: Array<{
      image: string
      title: string
      address?: string
      price?: string
      size?: string
      propertyType?: string
      agent?: string
      link?: string
    }> = []

    for (let i = 0; i < trackRecordData.length; i++) {
      const data = trackRecordData[i]
      try {
        // Use picsum.photos for placeholder images
        // Use different seed for each image to get variety
        const imageUrl = `https://picsum.photos/seed/track-record-${i}/200/300`
        const imageFilename = `track-record-${i}-${Date.now()}.jpg`
        
        console.log(`  📸 Uploading image ${i + 1}/10 from picsum.photos...`)
        const imageId = await uploadImageFromUrl(
          payload,
          imageUrl,
          data.title,
          imageFilename
        )

        if (!imageId) {
          console.log(`  ⚠️  Skipping item ${i + 1} - image upload failed`)
          continue
        }

        // Create item - title only or full details
        if (data.titleOnly) {
          items.push({
            image: imageId,
            title: data.title,
          })
        } else {
          items.push({
            image: imageId,
            title: data.title,
            address: data.address,
            price: data.price,
            size: data.size,
            propertyType: data.propertyType,
            agent: randomAgentId,
            link: data.link,
          })
        }

        console.log(`  ✅ Added "${data.title}" to track record`)
      } catch (error) {
        console.error(`  ❌ Error processing item ${i + 1}:`, error)
      }
    }

    if (items.length === 0) {
      console.log('⚠️  No items created. Skipping proven track record seed.')
      return
    }

    // Check if default set already exists
    const defaultSetIndex = sets.findIndex((set) => set.name === 'default')

    if (defaultSetIndex >= 0) {
      // Update existing default set
      sets[defaultSetIndex] = {
        name: 'default',
        items,
      }
      console.log('🔄 Updated existing "default" set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          items,
        },
        ...sets, // Add any existing sets after default
      ]
      console.log('➕ Created new "default" set')
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'provenTrackRecordSets',
      data: {
        sets,
      },
    })

    console.log('✅ Proven track record sets seeded successfully!')
    console.log(`   Default set contains ${items.length} items`)
    console.log(`   - ${items.filter((i) => !i.address).length} items with title only`)
    console.log(`   - ${items.filter((i) => i.address).length} items with full details`)
  } catch (error) {
    console.error('❌ Error seeding proven track record sets:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-proven-track-record.ts') ||
  process.argv[1]?.includes('seed-proven-track-record')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedProvenTrackRecord(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
