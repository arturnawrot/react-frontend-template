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
 * Seeds the 1031-exchange-support page
 * This function can be called from the main seed.ts or run independently
 */
export async function seed1031ExchangeSupportPage(payload: Payload) {
  try {
    console.log('Seeding 1031-exchange-support page...')

    // Get or upload media files
    const heroImageId = await getMediaIdByFilename(payload, 'three-men-looking-at-laptop.jpg')
    const splitSectionImageId = await getMediaIdByFilename(payload, 'happy-man-and-woman-looking-at-laptop.jpg')
    const flippedMImageId = await getMediaIdByFilename(payload, 'two-women-looking-at-raport-in-front-of-laptop.jpg')

    // Try to upload if they don't exist
    const publicDir = join(dirname_path, '..', '..', 'public')
    
    let finalHeroImageId = heroImageId
    if (!finalHeroImageId) {
      const heroImagePath = join(publicDir, 'img', 'three-men-looking-at-laptop.jpg')
      finalHeroImageId = await uploadMediaIfExists(payload, heroImagePath, 'three-men-looking-at-laptop')
    }

    let finalSplitSectionImageId = splitSectionImageId
    if (!finalSplitSectionImageId) {
      const splitSectionImagePath = join(publicDir, 'img', 'happy-man-and-woman-looking-at-laptop.jpg')
      finalSplitSectionImageId = await uploadMediaIfExists(payload, splitSectionImagePath, 'happy-man-and-woman-looking-at-laptop')
    }

    let finalFlippedMImageId = flippedMImageId
    if (!finalFlippedMImageId) {
      const flippedMImagePath = join(publicDir, 'img', 'two-women-looking-at-raport-in-front-of-laptop.jpg')
      finalFlippedMImageId = await uploadMediaIfExists(payload, flippedMImagePath, 'two-women-looking-at-raport-in-front-of-laptop')
    }

    // Get CSS style IDs
    const tanLinearStyleId = await getStyleId(payload, 'tan-linear-background')
    const linearGradientStyleId = await getStyleId(payload, 'linear-gradient-50white-50transparent')

    // Check if page with slug '1031-exchange-support' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: '1031-exchange-support',
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
            text: 'Your 1031',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Exchange,',
            breakOnMobile: true,
            breakOnDesktop: true,
          },
          {
            text: 'Strategically',
            color: '#DAE684',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Aligned',
            color: '#DAE684',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
        ],
        subheading: 'We help investors plan, identify, and acquire 1031 replacement properties with clarity and confidence.',
        ctaPrimaryLabel: 'Request 1031 Guidance',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalHeroImageId || undefined,
      },
      {
        blockType: 'splitSection' as const,
        image: finalSplitSectionImageId || undefined,
        imageAlt: 'Section image',
        isReversed: false,
        header: "Success Isn't Just About Deferral. It's About Direction.",
        bulletPoints: [
          {
            text: 'Identify the right replacement property before the clock runs out',
          },
          {
            text: 'Balance timing, yield, and growth goals',
          },
          {
            text: 'Avoid 11th-hour, misaligned reinvestments',
          },
        ],
        linkType: 'none' as const,
        openInNewTab: false,
      },
      {
        blockType: 'flippedM' as const,
        heading: 'A Process That Starts Before You Sell',
        subheading: 'Navigating a 1031 exchange successfully means planning ahead. With us by your side, complexity becomes simple.',
        bulletPoints: [
          {
            title: 'Pre-sale consultation & timeline planning',
            description: 'Set your goals and outline your ideal timeline. Thoughtful planning now means no surprises later.',
            linkText: '',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Buy box & market mapping',
            description: 'Define your criteria for replacement properties and assess against the current market.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Property sourcing (on & off-market)',
            description: 'Discover properties that align with your strategy from our extensive network.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Guided property tours or remote evaluation',
            description: "Whether remote or in-person, we'll make sure you have an in-depth understanding of potential buys.",
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Offer & due diligence support',
            description: 'Craft a competitive offer and rely on our proven expertise in running down every detail.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
        ],
        image: finalFlippedMImageId || undefined,
        ctaText: 'Talk to a 1031 Specialist',
        linkType: 'none' as const,
        openInNewTab: false,
      },
      {
        blockType: 'container' as const,
        cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
        blocks: [
          {
            blockType: 'container' as const,
            cssStyles: linearGradientStyleId ? [linearGradientStyleId] : [],
            blocks: [
              {
                blockType: 'cardSection' as const,
                title: 'Property Types Ideal for 1031',
                description: '',
                buttonText: '',
                linkType: 'none' as const,
                customUrl: 'https://tvn24.pl',
                openInNewTab: true,
                cardTextAlign: 'center' as const,
                cards: [
                  {
                    title: 'STNL (Net Lease)',
                    icon: 'fa-regular fa-building',
                    description: 'Single-tenant properties with streamlined agreements',
                  },
                  {
                    title: 'Retail Centers',
                    icon: 'fa-regular fa-building',
                    description: 'Single or multi-tenant properties designed for retail',
                  },
                  {
                    title: 'Office/Medical',
                    icon: 'fa-regular fa-building',
                    description: 'Properties housing professional services',
                  },
                  {
                    title: 'Industrial',
                    icon: 'fa-regular fa-building',
                    description: 'Properties designed for manufacturing, storage, or distribution',
                  },
                  {
                    title: 'Income-Producing Land',
                    icon: 'fa-regular fa-building',
                    description: 'Farmland, timberland, or land used for energy production',
                  },
                ],
              },
            ],
          },
          {
            blockType: 'featuredProperties' as const,
            featuredPropertySetName: 'default',
            heading: 'Featured Properties',
            seeAllLink: '/property-search',
          },
        ],
      },
      {
        blockType: 'ctaFooter' as const,
        heading: 'Have a Property to Sell or Funds to Reinvest?',
        subheading: "Let's map your 1031 strategy.",
        buttons: [
          {
            label: 'Talk to a 1031 Specialist',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'Submit Your Buy-Criteria',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'secondary' as const,
          },
          {
            label: 'See Investment Listings',
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
      console.log('Page with slug "1031-exchange-support" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: '1031 Exchange Support',
          slug: '1031-exchange-support',
          blocks: pageBlocks,
        },
      })

      console.log('✅ 1031 Exchange Support page updated successfully!')
    } else {
      console.log('Creating new 1031-exchange-support page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: '1031 Exchange Support',
          slug: '1031-exchange-support',
          blocks: pageBlocks,
        },
      })

      console.log('✅ 1031 Exchange Support page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding 1031-exchange-support page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:1031-exchange-support
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-1031-exchange-support.ts') ||
                      process.argv[1]?.includes('seed-1031-exchange-support')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seed1031ExchangeSupportPage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
