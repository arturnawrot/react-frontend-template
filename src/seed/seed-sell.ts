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

    const filename = filePath.split("/").pop() || filePath.split("\\").pop() || "unknown"
    
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
 * Seeds the sell page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedSellPage(payload: Payload) {
  try {
    console.log('Seeding sell page...')

    // Get media IDs
    const laptopHandsDeskImageId = await getMediaIdByFilename(payload, 'laptop-hands-desk.jpg')
    const threeMenMeetingImageId = await getMediaIdByFilename(payload, 'three-men-small-table-meeting.jpg')
    const forestPathImageId = await getMediaIdByFilename(payload, 'forest-path-drone-pov.jpg')
    const laptopPointingImageId = await getMediaIdByFilename(payload, 'laptop-pointing-at-screen.jpg')

    // Try to upload if they don't exist
    const publicDir = join(dirname_path, '..', '..', 'public')
    
    let finalLaptopHandsDeskImageId = laptopHandsDeskImageId
    if (!finalLaptopHandsDeskImageId) {
      const imagePath = join(publicDir, 'img', 'laptop-hands-desk.jpg')
      finalLaptopHandsDeskImageId = await uploadMediaIfExists(payload, imagePath, 'laptop-hands-desk')
    }

    let finalThreeMenMeetingImageId = threeMenMeetingImageId
    if (!finalThreeMenMeetingImageId) {
      const imagePath = join(publicDir, 'img', 'three-men-small-table-meeting.jpg')
      finalThreeMenMeetingImageId = await uploadMediaIfExists(payload, imagePath, 'three-men-small-table-meeting')
    }

    let finalForestPathImageId = forestPathImageId
    if (!finalForestPathImageId) {
      const imagePath = join(publicDir, 'img', 'forest-path-drone-pov.jpg')
      finalForestPathImageId = await uploadMediaIfExists(payload, imagePath, 'forest-path-drone-pov')
    }

    let finalLaptopPointingImageId = laptopPointingImageId
    if (!finalLaptopPointingImageId) {
      const imagePath = join(publicDir, 'img', 'laptop-pointing-at-screen.jpg')
      finalLaptopPointingImageId = await uploadMediaIfExists(payload, imagePath, 'laptop-pointing-at-screen')
    }

    // Get CSS style IDs
    const tanLinearStyleId = await getStyleId(payload, 'tan-linear-background')
    const linearGradientStyleId = await getStyleId(payload, 'linear-gradient-50white-50transparent')
    const wetSandStyleId = await getStyleId(payload, 'wet-sand-background')

    // Get page IDs for references
    const homePageId = await getPageIdBySlug(payload, 'home')
    const buyPageId = await getPageIdBySlug(payload, 'buy')

    // Check if page with slug 'sell' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'sell',
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
            text: 'Sell With Strategy.',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Close',
            color: '#DAE684',
            breakOnMobile: false,
            breakOnDesktop: true,
          },
          {
            text: 'With',
            color: '#DAE684',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Confidence.',
            color: '#DAE684',
            breakOnMobile: false,
            breakOnDesktop: false,
          },
        ],
        subheading: 'We help landowners, investors, and institutions navigate every step of the disposition process — with clarity, discretion, and performance.',
        ctaPrimaryLabel: 'Get Your Property Valued',
        ctaPrimaryLinkType: 'none' as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLabel: 'See Our Selling Process',
        ctaSecondaryLinkType: 'none' as const,
        ctaSecondaryOpenInNewTab: false,
        backgroundImage: finalLaptopHandsDeskImageId || undefined,
      },
      {
        blockType: 'splitSection' as const,
        image: finalThreeMenMeetingImageId || undefined,
        imageAlt: 'Section image',
        isReversed: false,
        header: "We don't rush listings. We unlock value.",
        bulletPoints: [
          { text: "Advisory-first approach — we don't just list, we guide" },
          { text: 'Backed by proprietary buyer networks and data' },
          { text: 'Trusted by family offices, developers, and REITs' },
        ],
        linkText: 'Talk to a Sell-Side Advisior',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'flippedM' as const,
        heading: 'From Valuation to Close - Our Proven Process.',
        subheading: "We've honed our process over thousands of deals so every transaction is optimized for your success.",
        bulletPoints: [
          {
            title: 'Initial Discovery & Property Review',
            description: 'Lay the groundwork for a successful sell through research and discovery.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Broker Opinion of Value (BOV)',
            description: 'Bring in professional brokers who know the market.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Buyer Targeting & Outreach',
            description: 'Identify the right buyer profile and get the word out.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Listing Package Prep (when public)',
            description: 'Compile all the relevant information and present it in a winning format.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            title: 'Negotiation, Due Diligence & Close',
            description: 'Negotiate with buyers, review every contract and LOI in details, and close with confidence.',
            linkType: 'none' as const,
            openInNewTab: false,
          },
        ],
        image: finalForestPathImageId || undefined,
        ctaText: 'See a Sample Timeline',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'container' as const,
        includeSpacing: false,
        cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
        blocks: [
          {
            blockType: 'container' as const,
            includeSpacing: false,
            cssStyles: linearGradientStyleId ? [linearGradientStyleId] : [],
            blocks: [
              {
                blockType: 'cardSection' as const,
                title: 'From Outparcels to Porfolios',
                description: '',
                buttonText: 'Explore Recent Deals',
                linkType: 'none' as const,
                openInNewTab: false,
                cardTextAlign: 'center' as const,
                cards: [
                  {
                    title: 'Land',
                    icon: 'fa-regular fa-handshake',
                    description: 'Lorem isum del sor let detole.',
                  },
                  {
                    title: 'Industrial & Flex',
                    icon: 'fa-regular fa-handshake',
                    description: 'Lorem isum del sor let detole.',
                  },
                  {
                    title: 'Retail & Mixed-Use',
                    icon: 'fa-regular fa-handshake',
                    description: 'Lorem isum del sor let detole.',
                  },
                  {
                    title: 'Office',
                    icon: 'fa-regular fa-handshake',
                    description: 'Lorem isum del sor let detole.',
                  },
                  {
                    title: 'Single-Tenant Net Lease',
                    icon: 'fa-regular fa-handshake',
                    description: 'Lorem isum del sor let detole.',
                  },
                ],
              },
            ],
          },
          {
            blockType: 'splitSection' as const,
            image: finalLaptopPointingImageId || undefined,
            imageAlt: 'Section image',
            isReversed: false,
            header: 'Discretion Adds Value',
            paragraph: 'When appropriate, we offer off-market strategies to match vetted buyers with high-value assets — without unnecessary exposure.',
            bulletPoints: [
              { text: 'Sample anonymized deal lorem ipsum?' },
              { text: 'Confidential deal closed at 12% premium' },
            ],
            linkText: 'Discuss Confidential Selling',
            linkType: 'page' as const,
            page: homePageId || undefined,
            openInNewTab: false,
          },
          {
            blockType: 'testimonialCarousel' as const,
            testimonialSetName: 'default',
          },
        ],
      },
      {
        blockType: 'faqSection' as const,
        faqSetName: 'default',
        heading: 'FAQs',
        description: 'Common questions from our clients. Feel free to reach out with more.',
        contactButtonText: 'Contact Us',
        linkType: 'page' as const,
        page: homePageId || undefined,
        openInNewTab: false,
      },
      {
        blockType: 'container' as const,
        includeSpacing: true,
        cssStyles: wetSandStyleId ? [wetSandStyleId] : [],
        blocks: [
          {
            blockType: 'agentCarousel' as const,
            preHeading: '',
            heading: 'Curious What Your Property Is Worth?',
            description: 'Request a Broker Opinion of Value — and get insight into timing, pricing, and demand.',
            linkText: 'Get Your Property Valued',
            linkType: 'page' as const,
            page: buyPageId || undefined,
            openInNewTab: false,
            featuredAgentSetName: 'default',
          },
        ],
      },
      {
        blockType: 'propertySearch' as const,
        heading: 'Local Insight. National Scale.',
        description: 'Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.',
        buttonText: 'Explore Properties by Market',
        propertiesCount: '99 Properties For Sale in or near Aiken',
      },
      {
        blockType: 'ctaFooter' as const,
        heading: 'Thinking About Selling? Start With Clarity',
        buttons: [
          {
            label: 'Request a Property Valuation',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'primary' as const,
          },
          {
            label: 'Talk to a Sell-Side Broker',
            linkType: 'none' as const,
            openInNewTab: false,
            variant: 'secondary' as const,
          },
          {
            label: 'See Our Selling Process',
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
      console.log('Page with slug "sell" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'Sell',
          slug: 'sell',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Sell page updated successfully!')
    } else {
      console.log('Creating new sell page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Sell',
          slug: 'sell',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Sell page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding sell page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:sell
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-sell.ts') ||
                      process.argv[1]?.includes('seed-sell')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedSellPage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
