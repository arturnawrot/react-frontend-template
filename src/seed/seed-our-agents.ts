import type { Payload } from 'payload'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'
import { getStyleId } from './seed-utils'

const filename = fileURLToPath(import.meta.url)
const dirname_path = dirname(filename)

/**
 * Helper function to get media ID by filename
 */
async function getMediaIdByFilename(
  payload: Payload,
  filename: string
): Promise<string | null> {
  try {
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return existing.docs[0].id
    }
    return null
  } catch (error) {
    console.error(`❌ Error finding media ${filename}:`, error)
    return null
  }
}

/**
 * Helper function to upload media file if it exists
 */
async function uploadMediaIfExists(
  payload: Payload,
  filePath: string,
  alt: string
): Promise<string | null> {
  try {
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      return null
    }

    const filename = filePath.split('/').pop() || filePath.split('\\').pop() || 'unknown'
    
    // Check if already exists
    const existingId = await getMediaIdByFilename(payload, filename)
    if (existingId) {
      return existingId
    }

    const uploaded = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      filePath,
    })

    return uploaded.id
  } catch (error) {
    console.error(`❌ Error uploading media ${filePath}:`, error)
    return null
  }
}

/**
 * Helper function to get page ID by slug
 */
async function getPageIdBySlug(
  payload: Payload,
  slug: string
): Promise<string | null> {
  try {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return existing.docs[0].id
    }
    return null
  } catch (error) {
    console.error(`❌ Error finding page ${slug}:`, error)
    return null
  }
}

/**
 * Seeds the our-agents page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedOurAgentsPage(payload: Payload) {
  try {
    console.log('Seeding our-agents page...')

    // Get or upload media files
    const threeWorkersImageId = await getMediaIdByFilename(payload, 'three-workers-happy.jpg')
    const menWomenMeetingImageId = await getMediaIdByFilename(payload, 'men-women-work-meeting.jpg')

    // Try to upload if they don't exist
    const publicDir = join(dirname_path, '..', '..', 'public')
    
    let finalThreeWorkersImageId = threeWorkersImageId
    if (!finalThreeWorkersImageId) {
      const threeWorkersImagePath = join(publicDir, 'img', 'three-workers-happy.jpg')
      finalThreeWorkersImageId = await uploadMediaIfExists(payload, threeWorkersImagePath, 'three-workers-happy')
    }

    let finalMenWomenMeetingImageId = menWomenMeetingImageId
    if (!finalMenWomenMeetingImageId) {
      const menWomenMeetingImagePath = join(publicDir, 'img', 'men-women-work-meeting.jpg')
      finalMenWomenMeetingImageId = await uploadMediaIfExists(payload, menWomenMeetingImagePath, 'men-women-work-meeting')
    }

    // Get page ID for home page (used in agentDecoration link)
    const homePageId = await getPageIdBySlug(payload, 'home')

    // Check if page with slug 'our-agents' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'our-agents',
        },
      },
      depth: 2,
      limit: 1,
    })

    const pageBlocks = [
      {
        blockType: 'hero' as const,
        variant: 'split' as const,
        headingSegments: [
          {
            text: 'Built on',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Relationships.',
            breakOnMobile: true,
            breakOnDesktop: true,
          },
          {
            text: 'Proven by Results.',
            color: '#DAE684',
            breakOnMobile: false,
            breakOnDesktop: false,
          },
        ],
        subheading: 'Work with a partner as committed to your success as you are.',
        ctaPrimaryLabel: 'View Agent Directory',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalThreeWorkersImageId || undefined,
      },
      {
        blockType: 'agentDecoration' as const,
        agentIconsSetName: 'default',
        heading: 'Find the Right\nPartner for Your\nProperty Goals',
        buttonText: 'Start ',
        linkType: homePageId ? ('page' as const) : ('none' as const),
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'agentDirectory' as const,
        heading: 'Agent Directory',
        itemsPerPage: 8,
      },
      {
        blockType: 'agentsByCategory' as const,
      },
      {
        blockType: 'trackRecordSection' as const,
        heading: 'Proven Track Record',
        provenTrackRecordSetName: 'default',
      },
      {
        blockType: 'cardOnBackground' as const,
        heading: 'Commercial Brokerage With Real Momentum',
        subheading: "We're growing - and always looking for strong talent. If you're client-first, strategic, and hungry to grow, we want to talk.",
        backgroundImage: finalMenWomenMeetingImageId || undefined,
        ctaText: 'Start',
        linkType: 'none' as const,
        openInNewTab: false,
        excludeSpacing: true,
      },
      {
        blockType: 'ctaFooter' as const,
        heading: "Let's Match You With the Right Broker",
        buttons: [
          {
            label: 'Find an Agent',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'Request a Broker Match',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'secondary' as const,
          },
          {
            label: 'Schedule a Consultation',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'secondary' as const,
          },
        ],
      },
      {
        blockType: 'footer' as const,
      },
    ]

    if (existing.docs.length > 0) {
      console.log('Page with slug "our-agents" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'our-agents',
          slug: 'our-agents',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Our-agents page updated successfully!')
    } else {
      console.log('Creating new our-agents page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'our-agents',
          slug: 'our-agents',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Our-agents page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding our-agents page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:our-agents
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-our-agents.ts') ||
                      process.argv[1]?.includes('seed-our-agents')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedOurAgentsPage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
