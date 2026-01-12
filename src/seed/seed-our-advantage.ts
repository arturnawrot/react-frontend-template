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
 * Seeds the our-advantage page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedOurAdvantagePage(payload: Payload) {
  try {
    console.log('Seeding our-advantage page...')

    // Get or upload media files
    const heroImageId = await getMediaIdByFilename(payload, 'three-people-talking-earpod-meeting.jpg')
    const flippedMImageId = await getMediaIdByFilename(payload, 'man-woman-sitting-in-front-of-each-other.jpg')

    // Try to upload if they don't exist (check correct subdirectories)
    const publicDir = join(dirname_path, '..', '..', 'public')
    
    let finalHeroImageId = heroImageId
    if (!finalHeroImageId) {
      const heroImagePath = join(publicDir, 'img', 'three-people-talking-earpod-meeting.jpg')
      finalHeroImageId = await uploadMediaIfExists(payload, heroImagePath, 'three-people-talking-earpod-meeting')
    }

    let finalFlippedMImageId = flippedMImageId
    if (!finalFlippedMImageId) {
      const flippedMImagePath = join(publicDir, 'img', 'man-woman-sitting-in-front-of-each-other.jpg')
      finalFlippedMImageId = await uploadMediaIfExists(payload, flippedMImagePath, 'man-woman-sitting-in-front-of-each-other')
    }

    // Get CSS style IDs (should have been created above)
    const tanLinearStyleId = await getStyleId(payload, 'tan-linear-background')
    const linearGradientStyleId = await getStyleId(payload, 'linear-gradient-50white-50transparent')

    // Get page ID for home page (used in agentIconsSection)
    const homePageId = await getPageIdBySlug(payload, 'home')

    // Check if page with slug 'our-advantage' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'our-advantage',
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
            text: 'What Sets',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Meybohm',
            breakOnMobile: true,
            breakOnDesktop: true,
          },
          {
            text: 'Commercial',
            breakOnMobile: false,
            breakOnDesktop: false,
          },
          {
            text: 'Apart',
            color: '#DAE684',
            breakOnMobile: false,
            breakOnDesktop: false,
          },
        ],
        subheading: 'We deliver high-performance real-estate solutions through long-term partnerships, strategic execution, and a wide-lens perspective.',
        ctaPrimaryLabel: 'See Our Process',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalHeroImageId || undefined,
      },
      {
        blockType: 'container' as const,
        includeSpacing: false,
        cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
        blocks: [
          {
            blockType: 'container' as const,
            includeSpacing: true,
            cssStyles: linearGradientStyleId ? [linearGradientStyleId] : [],
            blocks: [
              {
                blockType: 'cardSection' as const,
                title: 'Built Different — On Purpose',
                description: '',
                buttonText: 'What Makes Us Different',
                linkType: 'none' as const,
                openInNewTab: false,
                cardTextAlign: 'left' as const,
                cards: [
                  {
                    title: 'Partnership',
                    icon: 'fa-regular fa-handshake',
                    description: 'We build lasting relationships, offering fiduciary-level care and strategic guidance beyond the deal.',
                  },
                  {
                    title: 'Performance',
                    icon: 'fa-regular fa-handshake',
                    description: 'Our data-driven insights and disciplined approach deliver high-value, measurable results we\'re proud to stand behind.',
                  },
                  {
                    title: 'Perspective',
                    icon: 'fa-regular fa-handshake',
                    description: 'We take a holistic approach, ensuring real-estate decisions align with broader wealth strategies and your highest priority values.',
                  },
                ],
              },
            ],
          },
          {
            blockType: 'flippedM' as const,
            heading: 'A Process Designed to Create Value',
            subheading: 'Every assignment starts with alignment and ends with execution. Here\'s how we get there.',
            bulletPoints: [
              {
                title: 'Discovery & Goal Mapping',
                description: 'We\'ll do a deep dive into your goals so that every decision is informed by the big picture.',
                linkType: 'none' as const,
                openInNewTab: false,
              },
              {
                title: 'Market Strategy & Targeting',
                description: 'We\'ll analyze the market, comb through data, and identify the best opportunities for your goals.',
                linkType: 'none' as const,
                openInNewTab: false,
              },
              {
                title: 'Tactical Execution',
                description: 'We\'ll move decisively and effectively to buy, sell, or lease the best properties for you portfolio.',
                linkType: 'none' as const,
                openInNewTab: false,
              },
              {
                title: 'Negotiation & Close',
                description: 'We\'ll handle all the critical details where great deals are won so you can move ahead with confidence, ',
                linkType: 'none' as const,
                openInNewTab: false,
              },
            ],
            image: finalFlippedMImageId || undefined,
            ctaText: 'Explore the Full Process',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            blockType: 'agentIconsSection' as const,
            agentIconsSetName: 'default',
            header: 'Trusted by Investors, Owners and Institutions',
            paragraph: 'From multigenerational landowners to institutional fund managers, our clients trust us to move capital with clarity.',
            linkText: 'See Whoe We Serve',
            linkType: 'page' as const,
            page: homePageId || undefined,
            openInNewTab: false,
          },
          {
            blockType: 'trackRecordSection' as const,
            heading: 'Results that Speak for Themselves',
            provenTrackRecordSetName: 'default',
          },
          {
            blockType: 'testimonialCarousel' as const,
            testimonialSetName: 'default',
          },
        ],
      },
      {
        blockType: 'ctaFooter' as const,
        heading: 'Looking for More Than a Brokerage?',
        subheading: "Let's build a strategy for your next move.",
        buttons: [
          {
            label: 'Talk to Our Team',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'See Our Services',
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
      console.log('Page with slug "our-advantage" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'Our Advantage',
          slug: 'our-advantage',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Our Advantage page updated successfully!')
    } else {
      console.log('Creating new our-advantage page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Our Advantage',
          slug: 'our-advantage',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Our Advantage page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding our-advantage page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:our-advantage
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-our-advantage.ts') ||
                      process.argv[1]?.includes('seed-our-advantage')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedOurAdvantagePage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
