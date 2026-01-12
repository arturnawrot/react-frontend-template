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
 * Seeds the buyer-representation page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedBuyerRepresentationPage(payload: Payload) {
  try {
    console.log('Seeding buyer-representation page...')

    // Get or upload media files
    const heroImageId = await getMediaIdByFilename(payload, 'buyer-representation-hero.jpg')
    const handshakeImageId = await getMediaIdByFilename(payload, 'two-men-handshake.jpg')
    const writingImageId = await getMediaIdByFilename(payload, 'writing-pen-notebook.jpg')
    const meetingImageId = await getMediaIdByFilename(payload, 'men-talking-in-a-meeting.jpg')

    // Try to upload if they don't exist
    const publicDir = join(dirname_path, '..', '..', 'public')
    
    let finalHeroImageId = heroImageId
    if (!finalHeroImageId) {
      const heroImagePath = join(publicDir, 'img', 'buyer-representation-hero.jpg')
      finalHeroImageId = await uploadMediaIfExists(payload, heroImagePath, 'buyer-representation-hero')
    }

    let finalHandshakeImageId = handshakeImageId
    if (!finalHandshakeImageId) {
      const handshakeImagePath = join(publicDir, 'img', 'two-men-handshake.jpg')
      finalHandshakeImageId = await uploadMediaIfExists(payload, handshakeImagePath, 'two-men-handshake')
    }

    let finalWritingImageId = writingImageId
    if (!finalWritingImageId) {
      const writingImagePath = join(publicDir, 'img', 'writing-pen-notebook.jpg')
      finalWritingImageId = await uploadMediaIfExists(payload, writingImagePath, 'writing-pen-notebook')
    }

    let finalMeetingImageId = meetingImageId
    if (!finalMeetingImageId) {
      const meetingImagePath = join(publicDir, 'img', 'men-talking-in-a-meeting.jpg')
      finalMeetingImageId = await uploadMediaIfExists(payload, meetingImagePath, 'men-talking-in-a-meeting')
    }

    // Get page reference for "Home" page
    const homePageId = await getPageIdBySlug(payload, 'home')

    // Check if page with slug 'buyer-representation' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'buyer-representation',
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
            text: 'We Represent',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Buyers Who',
            breakOnMobile: true,
            breakOnDesktop: true,
          },
          {
            text: 'Think',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Strategically',
            color: '#DAE684',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
        ],
        subheading: 'From investment acquisitions to site selection, we find opportunities that align with you best interests.',
        ctaPrimaryLabel: 'Start the Conversation',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalHeroImageId || undefined,
      },
      {
        blockType: 'splitSection' as const,
        image: finalHandshakeImageId || undefined,
        imageAlt: 'Section image',
        isReversed: false,
        header: 'Buying With Us Means a Tangible Advantage',
        bulletPoints: [
          {
            text: 'Gain access to off-market and pre-list opportunities',
          },
          {
            text: 'Let our team guide zoning, use, and location fit',
          },
          {
            text: 'Reduce negotiation friction with experienced advisors',
          },
        ],
        linkType: 'none' as const,
        openInNewTab: false,
      },
      {
        blockType: 'flippedM' as const,
        heading: 'Clarity From First Call to Close',
        subheading: 'We help you navigate the complexity and nuance of real estate with insight and confidence.',
        bulletPoints: [
          {
            title: 'Discovery & Requirements',
            description: "Define your ideal property and investment criteria so you're ready to move strategically when opportunities arise.",
            linkText: '.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Market Scan & Match',
            description: 'Leave no stone unturned in the search. Through our network of brokers and partners you have access to both on and off-market deals.',
            linkText: '.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Site Tours & Advisory',
            description: 'Walk through potential sites armed with our expertise and analytical eye.',
            linkText: '.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Offer Strategy & Negotiation',
            description: 'Craft competitive, transparent, and well-structured offers that align with your goals and give sellers confidence.',
            linkText: '.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Due Diligence & Closing',
            description: "Close confidently knowing that we've combed through every detail and dotted every i.",
            linkText: '123123test1',
            linkType: 'page' as const,
            page: homePageId || undefined,
            openInNewTab: true,
          },
        ],
        image: finalWritingImageId || undefined,
        ctaText: 'See Current Opportunities',
        linkType: 'none' as const,
        openInNewTab: false,
      },
      {
        blockType: 'splitSection' as const,
        image: finalMeetingImageId || undefined,
        imageAlt: 'Section image',
        isReversed: false,
        header: 'Leverage Our Network',
        paragraph: "Many of our acquisitions never hit the public market. We'll match your criteria to properties quietly available or privately held.",
        bulletPoints: [],
        linkText: 'Submit Buy Criteria',
        linkType: 'custom' as const,
        customUrl: 'https://tvn24.pl',
        openInNewTab: false,
      },
      {
        blockType: 'ctaFooter' as const,
        heading: "Looking for the Right Buy? Let's find it.",
        buttons: [
          {
            label: "Talk to a Buyer's Rep",
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'Submit Criteria',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'secondary' as const,
          },
          {
            label: 'Browse Properties',
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
      console.log('Page with slug "buyer-representation" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'Buyer Representation',
          slug: 'buyer-representation',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Buyer Representation page updated successfully!')
    } else {
      console.log('Creating new buyer-representation page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Buyer Representation',
          slug: 'buyer-representation',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Buyer Representation page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding buyer-representation page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:buyer-representation
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-buyer-representation.ts') ||
                      process.argv[1]?.includes('seed-buyer-representation')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedBuyerRepresentationPage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
