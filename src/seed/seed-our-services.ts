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
 * Seeds the our-services page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedOurServicesPage(payload: Payload) {
  try {
    console.log('Seeding our-services page...')

    // Get or upload media files
    const forestPathImageId = await getMediaIdByFilename(payload, 'forest-path-drone-pov.jpg')
    const workOfficeImageId = await getMediaIdByFilename(payload, 'work-office-meeting.jpg')
    const recteoImageId = await getMediaIdByFilename(payload, 'recteo.jpg')
    const constructionImageId = await getMediaIdByFilename(payload, 'construction-site.jpg')
    const manWomanTalkingImageId = await getMediaIdByFilename(payload, 'man-woman-talking-in-front-of-computers.jpg')
    const womanStickyNotesImageId = await getMediaIdByFilename(payload, 'woman-sticky-notes.jpg')
    const personHoldingBagImageId = await getMediaIdByFilename(payload, 'person-holding-bag.jpg')

    // Try to upload if they don't exist
    const publicDir = join(dirname_path, '..', '..', 'public')
    
    let finalForestPathImageId = forestPathImageId
    if (!finalForestPathImageId) {
      const imagePath = join(publicDir, 'img', 'forest-path-drone-pov.jpg')
      finalForestPathImageId = await uploadMediaIfExists(payload, imagePath, 'forest-path-drone-pov')
    }

    let finalWorkOfficeImageId = workOfficeImageId
    if (!finalWorkOfficeImageId) {
      const imagePath = join(publicDir, 'img', 'work-office-meeting.jpg')
      finalWorkOfficeImageId = await uploadMediaIfExists(payload, imagePath, 'work-office-meeting')
    }

    let finalRecteoImageId = recteoImageId
    if (!finalRecteoImageId) {
      const imagePath = join(publicDir, 'img', 'recteo.jpg')
      finalRecteoImageId = await uploadMediaIfExists(payload, imagePath, 'recteo')
    }

    let finalConstructionImageId = constructionImageId
    if (!finalConstructionImageId) {
      const imagePath = join(publicDir, 'img', 'construction-site.jpg')
      finalConstructionImageId = await uploadMediaIfExists(payload, imagePath, 'construction-site')
    }

    let finalManWomanTalkingImageId = manWomanTalkingImageId
    if (!finalManWomanTalkingImageId) {
      const imagePath = join(publicDir, 'img', 'man-woman-talking-in-front-of-computers.jpg')
      finalManWomanTalkingImageId = await uploadMediaIfExists(payload, imagePath, 'man-woman-talking-in-front-of-computers')
    }

    let finalWomanStickyNotesImageId = womanStickyNotesImageId
    if (!finalWomanStickyNotesImageId) {
      const imagePath = join(publicDir, 'img', 'woman-sticky-notes.jpg')
      finalWomanStickyNotesImageId = await uploadMediaIfExists(payload, imagePath, 'woman-sticky-notes')
    }

    let finalPersonHoldingBagImageId = personHoldingBagImageId
    if (!finalPersonHoldingBagImageId) {
      const imagePath = join(publicDir, 'img', 'person-holding-bag.jpg')
      finalPersonHoldingBagImageId = await uploadMediaIfExists(payload, imagePath, 'person-holding-bag')
    }

    // Get home page ID for splitSection links
    const homePageId = await getPageIdBySlug(payload, 'home')

    // Check if page with slug 'our-services' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'our-services',
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
            text: 'Beyond',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Brokerage:',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Services',
            color: '',
            breakOnMobile: false,
            breakOnDesktop: true,
          },
          {
            text: 'That',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Support',
            color: '#DAE684',
            breakOnMobile: false,
            breakOnDesktop: false,
          },
          {
            text: 'the Full',
            breakOnMobile: true,
            breakOnDesktop: true,
          },
          {
            text: 'Property Lifecycle',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
        ],
        subheading: 'From project planning to property management, Meybohm supports every phase of your commercial investment.',
        ctaPrimaryLabel: 'Explore Our Capabilities',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalForestPathImageId || undefined,
      },
      {
        blockType: 'splitSection' as const,
        image: finalWorkOfficeImageId || undefined,
        imageAlt: '',
        isReversed: false,
        header: "Advisory That's Invested",
        paragraph: "We're as committed to your success as you are at every stage of your investment journey.",
        bulletPoints: [
          {
            text: 'Investment planning',
          },
          {
            text: 'Land use and development strategy',
          },
          {
            text: 'Portfolio decision support',
          },
        ],
        linkText: 'See Planning & Consulting',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'splitSection' as const,
        image: finalRecteoImageId || undefined,
        imageAlt: 'Section image',
        isReversed: true,
        header: 'Property Management',
        paragraph: 'We manage over 1 million square feet of retail and office space — delivering tenant satisfaction, financial clarity, and property performance.',
        bulletPoints: [
          {
            text: 'Tenant relations',
          },
          {
            text: 'Maintenance coordination',
          },
          {
            text: 'Financial reporting and accounting',
          },
        ],
        linkText: 'View Management Services',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'splitSection' as const,
        image: finalConstructionImageId || undefined,
        imageAlt: 'Section image',
        isReversed: false,
        header: 'Built for Ground-Up Success',
        paragraph: 'From site selection to construction, we support projects from start to finish.',
        bulletPoints: [
          {
            text: 'Build-to-suit execution',
          },
          {
            text: 'Project management',
          },
          {
            text: 'Land acquisition and planning',
          },
        ],
        linkText: 'Explore Development',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'splitSection' as const,
        image: finalManWomanTalkingImageId || undefined,
        imageAlt: 'Section image',
        isReversed: true,
        header: 'Get Eyes on Your Asset and Offers on the Table',
        paragraph: 'Our team combines timeless principles with modern tools to market and move your property with precision.',
        bulletPoints: [
          {
            text: 'Listing strategy & materials',
          },
          {
            text: 'Buyer targeting',
          },
          {
            text: 'Local-to-national syndication',
          },
        ],
        linkText: 'See How We Sell',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'splitSection' as const,
        image: finalWomanStickyNotesImageId || undefined,
        imageAlt: 'Section image',
        isReversed: false,
        header: 'Vision-Driven Property Guidance',
        paragraph: 'Whether you\'re improving, selling, or holding, we help you think beyond the next transaction.',
        bulletPoints: [
          {
            text: 'Succession planning',
          },
          {
            text: 'Conservation & use optimization',
          },
          {
            text: 'Land improvement strategies',
          },
        ],
        linkText: 'Start Planning',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'splitSection' as const,
        image: finalPersonHoldingBagImageId || undefined,
        imageAlt: 'Section image',
        isReversed: true,
        header: 'Portfolio Oversight for Long-Term Growth',
        paragraph: 'For institutional clients and growing owners, we offer holistic portfolio insight and performance monitoring.',
        bulletPoints: [],
        linkText: 'Coming Soon',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'ctaFooter' as const,
        heading: 'Need Strategic Support for Your Property or Portfolio?',
        subheading: "Let's start the conversation",
        buttons: [
          {
            label: 'Talk to A Service Lead',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'See Success Stories',
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
      console.log('Page with slug "our-services" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'Our Services',
          slug: 'our-services',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Our Services page updated successfully!')
    } else {
      console.log('Creating new our-services page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Our Services',
          slug: 'our-services',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Our Services page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding our-services page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:our-services
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-our-services.ts') ||
                      process.argv[1]?.includes('seed-our-services')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedOurServicesPage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
