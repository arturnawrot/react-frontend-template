import type { Payload } from 'payload'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getStyleId } from './seed-utils'

const filename = fileURLToPath(import.meta.url)
const dirname_path = dirname(filename)

/**
 * Seeds the buy page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedBuyPage(payload: Payload) {
  try {
    console.log('Seeding buy page...')

    // Upload amazon_fc-1.png image to media collection (for splitSection)
    let amazonImageId: string | null = null
    const existingImage = await payload.find({
      collection: 'media',
      where: {
        filename: {
          contains: 'amazon_fc',
        },
      },
      limit: 1,
    })

    if (existingImage.docs.length > 0) {
      amazonImageId = existingImage.docs[0].id
      console.log('⏭️  Amazon FC image already exists in media')
    } else {
      try {
        const imagePath = join(dirname_path, '..', '..', 'public', 'img', 'amazon_fc.png')
        
        const uploadedImage = await payload.create({
          collection: 'media',
          data: {
            alt: '.',
          },
          filePath: imagePath,
        })

        amazonImageId = uploadedImage.id
        console.log('✅ Uploaded amazon_fc-1.png to media collection')
      } catch (error) {
        console.error('❌ Error uploading amazon_fc-1.png:', error)
        console.log('⚠️  Continuing without image...')
      }
    }

    // Get CSS style IDs
    const tanLinearStyleId = await getStyleId(payload, 'tan-linear-background')
    const linearGradientStyleId = await getStyleId(payload, 'linear-gradient-50white-50transparent')
    const background50StrongGreenId = await getStyleId(payload, 'background-50strong_green-50transparent')

    // Check if page with slug 'buy' already exists
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: 'buy',
        },
      },
      depth: 2,
      limit: 1,
    })

    const pageBlocks = [
      {
        blockType: 'hero' as const,
        variant: 'full-width-color' as const,
        headingSegments: [
          {
            text: 'Buy With Insight.',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: 'Invest With Confidence.',
            color: '#DAE684',
            breakOnMobile: true,
            breakOnDesktop: false,
          },
        ],
        subheading: "Approach every deal confidently, knowing you're backed by analytical excellence, investment foresight, and personal care.",
        ctaPrimaryLabel: 'Start Your Property Search',
        ctaSecondaryLabel: 'Schedule a Consultation',
      },
      {
        blockType: 'container' as const,
        cssStyles: background50StrongGreenId ? [background50StrongGreenId] : [],
        blocks: [
          {
            blockType: 'propertySearchInput' as const,
          },
        ],
      },
      {
        blockType: 'featuredProperties' as const,
        featuredPropertySetName: 'default',
        heading: 'Featured Properties',
        seeAllLink: '/property-search',
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
                description: 'In every transaction and relationship we hold true to our guiding principles.',
                buttonText: 'What Makes Us Different',
                linkType: 'none' as const,
                openInNewTab: false,
                cards: [
                  {
                    title: 'Partnership',
                    icon: 'fa-regular fa-handshake',
                    description: "We build lasting relationships, offering fiduciary-level care and strategic guidance beyond the deal.",
                  },
                  {
                    title: 'Performance',
                    icon: 'fa-regular fa-handshake',
                    description: "Our data-driven insights and disciplined approach deliver high-value, measurable results we're proud to stand behind.",
                  },
                  {
                    title: 'Performance',
                    icon: 'fa-regular fa-handshake',
                    description: "Our data-driven insights and disciplined approach deliver high-value, measurable results we're proud to stand behind.",
                  },
                  {
                    title: 'Performance',
                    icon: 'fa-regular fa-handshake',
                    description: "Our data-driven insights and disciplined approach deliver high-value, measurable results we're proud to stand behind.",
                  },
                  {
                    title: 'Perspective',
                    icon: 'fa-regular fa-handshake',
                    description: 'We take a holistic approach, ensuring real estate decisions align with broader wealth strategies and your highest priority values.',
                  },
                ],
              },
            ],
          },
          {
            blockType: 'testimonialCarousel' as const,
            testimonialSetName: 'default',
          },
          {
            blockType: 'splitSection' as const,
            header: 'Navigating Complex Transactions with Confidence',
            bulletPoints: [
              { text: '1031 Exchange Advisory' },
              { text: 'Portfolio Structuring' },
              { text: 'Multi-Market Acquisition' },
            ],
            linkText: 'Learn About Our Process',
            linkType: 'none' as const,
            openInNewTab: false,
            image: amazonImageId,
          },
          {
            blockType: 'insightsSection' as const,
            featuredArticleSetName: 'default',
            heading: 'Insights That Shape Smart Investments',
            linkText: 'Explore More Insights',
            linkType: 'none' as const,
            openInNewTab: false,
          },
          {
            blockType: 'container' as const,
            cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
            blocks: [
              {
                blockType: 'trackRecordSection' as const,
                heading: 'Proven Track Record',
                provenTrackRecordSetName: 'default',
              },
              {
                blockType: 'propertySearch' as const,
                heading: 'Local Insight. National Scale.',
                description: 'Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.',
                buttonText: 'Explore Properties by Market',
                propertiesCount: '99 Properties For Sale in or near Aiken',
              },
              {
                blockType: 'agentCarousel' as const,
                preHeading: 'Meet Our Agents',
                heading: 'Experience that Performs',
                description: "We're proud to bring a wealth of knowledge and relational capital to every deal and partnership.",
                linkText: 'Find an Agent',
                linkType: 'none' as const,
                openInNewTab: false,
                featuredAgentSetName: 'default',
              },
            ],
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
      console.log('Page with slug "buy" already exists. Updating...')

      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          title: 'Buy',
          slug: 'buy',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Buy page updated successfully!')
    } else {
      console.log('Creating new buy page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Buy',
          slug: 'buy',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Buy page created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding buy page:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:buy
// Check if this file is being run directly (not imported)
const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` || 
                      process.argv[1]?.includes('seed-buy.ts') ||
                      process.argv[1]?.includes('seed-buy')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')
    const { seedCSSStyles, seedNavbar } = await import('./seed-utils')
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedBuyPage(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}

