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
 * Seeds the home page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedHomePage(payload: Payload) {
  try {
    console.log('Seeding home page...')

    // Get or upload media files
    const heroImageId = await getMediaIdByFilename(payload, 'hero.webp')
    const heroVideoId = await getMediaIdByFilename(payload, 'meybohm-home-hero-video-compressed-10mb.mp4')
    const handshakeImageId = await getMediaIdByFilename(payload, 'two-men-handshake.jpg')

    // Try to upload if they don't exist (check common locations)
    const publicDir = join(dirname_path, '..', '..', 'public')
    const mediaDir = join(dirname_path, '..', '..', 'media')
    
    let finalHeroImageId = heroImageId
    if (!finalHeroImageId) {
      const heroImagePath = join(publicDir, 'hero.webp')
      finalHeroImageId = await uploadMediaIfExists(payload, heroImagePath, 'hero')
    }

    let finalHeroVideoId = heroVideoId
    if (!finalHeroVideoId) {
      const heroVideoPath = join(publicDir, 'meybohm-home-hero-video-compressed-10mb.mp4')
      finalHeroVideoId = await uploadMediaIfExists(payload, heroVideoPath, 'video')
    }

    let finalHandshakeImageId = handshakeImageId
    if (!finalHandshakeImageId) {
      const handshakeImagePath = join(publicDir, 'two-men-handshake.jpg')
      finalHandshakeImageId = await uploadMediaIfExists(payload, handshakeImagePath, 'two-men-handshake')
    }

    // Get CSS style IDs (should have been created above)
    const tanLinearStyleId = await getStyleId(payload, 'tan-linear-background')
    const linearGradientStyleId = await getStyleId(payload, 'linear-gradient-50white-50transparent')

    // Check if page with slug 'home' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'home',
        },
      },
      depth: 2,
      limit: 1,
    })

    const pageBlocks = [
      {
        blockType: 'hero' as const,
        variant: 'default' as const,
        headingSegments: [
          {
            text: 'Smart Moves.',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Strong Futures.',
            color: '#DAE684',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
        ],
        subheading:
          'Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective.',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalHeroImageId || undefined,
        backgroundVideo: finalHeroVideoId || undefined,
      },
      {
        blockType: 'container' as const,
        cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
        blocks: [
          {
            blockType: 'flippedM' as const,
            heading: 'Built on more than \ntransactions.',
            subheading:
              "We advise with the same care we'd want for our own portfolio. Whether you're investing, expanding, or exiting - we're built for your next move.",
            bulletPoints: [
              {
                title: 'Acquisition support for owner-operators and investors.',
                description:
                  "Whether you're expanding your business or building out your portfolio, we offer the guidance and expertise to transform real estate into lasting prosperity.",
                linkText: 'See All Buying',
                linkType: 'none' as const,
                openInNewTab: false,
              },
              {
                title: 'Space strategy and tenant representation.',
                description:
                  'Our holistic approach to real estate means we equip you for every facet of ownership and investment - from long-term thinking to immediate solutions.',
                linkText: 'See All Leasing',
                linkType: 'none' as const,
                openInNewTab: false,
              },
              {
                title: 'Disposition and portfolio exit planning.',
                description:
                  "When it's time to make a strategic exit we have the experience and track-record to guide you towards the best possible returns and tax-friendly options.",
                linkText: 'See All Selling',
                linkType: 'none' as const,
                openInNewTab: false,
              },
            ],
            image: finalHandshakeImageId || undefined,
            linkType: 'none' as const,
            openInNewTab: false,
          },
        ],
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
                title: 'Relationships Built for the Long Game',
                description:
                  'In every transaction and relationship we hold true to our guiding principles.',
                buttonText: 'What Makes Us Different',
                linkType: 'none' as const,
                openInNewTab: false,
                cardTextAlign: 'left' as const,
                cards: [
                  {
                    title: 'Partnership',
                    icon: 'fa-regular fa-handshake',
                    description:
                      "We build lasting relationships, offering fiduciary-level care and strategic guidance beyond the deal.",
                  },
                  {
                    title: 'Performance',
                    icon: 'fa-regular fa-handshake',
                    description:
                      "Our data-driven insights and disciplined approach deliver high-value, measurable results we're proud to stand behind.",
                  },
                  {
                    title: 'Perspective',
                    icon: 'fa-regular fa-handshake',
                    description:
                      'We take a holistic approach, ensuring real estate decisions align with broader wealth strategies and your highest priority values.',
                  },
                ],
              },
            ],
          },
          {
            blockType: 'propertySearch' as const,
            heading: 'Local Insight. National Scale.',
            description:
              'Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.',
            buttonText: 'Explore Properties by Market',
            propertiesCount: '',
          },
          {
            blockType: 'testimonialCarousel' as const,
            testimonialSetName: 'default',
          },
          {
            blockType: 'agentCarousel' as const,
            preHeading: 'Meet Our Agents',
            heading: 'Experience that Performs',
            description:
              "We're proud to bring a wealth of knowledge and relational capital to every deal and partnership.",
            linkType: 'none' as const,
            openInNewTab: false,
            featuredAgentSetName: 'default',
          },
        ],
      },
      {
        blockType: 'ctaFooter' as const,
        heading: 'Ready to make your next move?',
        buttons: [
          {
            label: 'Schedule a Consultation',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'Get Matched with a Agent',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'secondary' as const,
          },
          {
            label: 'Search Listings',
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
      console.log('Page with slug "home" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'Home',
          slug: 'home',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Home page updated successfully!')
    } else {
      console.log('Creating new home page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Home page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding home page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:home
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-home.ts') ||
                      process.argv[1]?.includes('seed-home')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedHomePage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}

