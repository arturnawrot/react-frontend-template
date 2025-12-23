import type { Payload } from 'payload'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getStyleId } from '../seed-utils'

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
        const imagePath = join(dirname_path, '..', '..', 'public', 'img', 'amazon_fc-1.png')
        
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
        blockType: 'hero',
        variant: 'full-width-color',
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
        blockType: 'container',
        cssStyles: background50StrongGreenId ? [background50StrongGreenId] : [],
        blocks: [
          {
            blockType: 'propertySearchInput',
          },
        ],
      },
      {
        blockType: 'featuredProperties',
        heading: 'Featured Properties',
        seeAllLink: '/property-search',
      },
      {
        blockType: 'container',
        cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
        blocks: [
          {
            blockType: 'container',
            cssStyles: linearGradientStyleId ? [linearGradientStyleId] : [],
            blocks: [
              {
                blockType: 'cardSection',
                title: 'Relationships Built for the Long Game',
                description: 'In every transaction and relationship we hold true to our guiding principles.',
                buttonText: 'What Makes Us Different',
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
            blockType: 'testimonialCarousel',
            testimonials: [
              {
                quote: "...The Meybohm team helped us expand into three cities and we couldn't trust anyone else.",
                author: "John",
                company: "Company Name"
              },
              {
                quote: "Working with Meybohm transformed our business. Their expertise and dedication were unmatched.",
                author: "Sarah",
                company: "Tech Solutions Inc"
              },
              {
                quote: "The professionalism and attention to detail from the Meybohm team exceeded all our expectations.",
                author: "Michael",
                company: "Growth Partners LLC"
              }
            ],
          },
          {
            blockType: 'splitSection',
            header: 'Navigating Complex Transactions with Confidence',
            bulletPoints: [
              { text: '1031 Exchange Advisory' },
              { text: 'Portfolio Structuring' },
              { text: 'Multi-Market Acquisition' },
            ],
            linkText: 'Learn About Our Process',
            linkHref: '#',
            image: amazonImageId,
          },
          {
            blockType: 'insightsSection',
            heading: 'Insights That Shape Smart Investments',
            linkText: 'Explore More Insights',
            linkHref: '#',
            articles: [
              {
                title: 'Top 5 Growth Corridors in 2025 in the United States',
                tags: [{ tag: 'Market' }, { tag: 'Trends' }],
                // Note: image needs to be uploaded separately in admin panel
              },
              {
                title: 'Sustainable Urban Planning: The Bridge to the Future',
                tags: [{ tag: 'Eco' }, { tag: 'Planning' }],
                // Note: image needs to be uploaded separately in admin panel
              },
              {
                title: 'Nightlife Economies: Revitalizing Downtown Districts',
                tags: [{ tag: 'Urban' }, { tag: 'Retail' }],
                // Note: image needs to be uploaded separately in admin panel
              },
            ],
          },
          {
            blockType: 'container',
            cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
            blocks: [
              {
                blockType: 'trackRecordSection',
                heading: 'Proven Track Record',
                properties: [
                  {
                    title: 'Closed in 45 Days',
                    // Note: image needs to be uploaded separately in admin panel
                  },
                  {
                    title: 'Closed in 45 Days',
                    address: '105 Lancaster St SW',
                    price: '$700,000',
                    size: '4,961 SF',
                    type: 'Office Space',
                    agentName: 'Jane Smith',
                    // Note: image and agentImage need to be uploaded separately in admin panel
                  },
                ],
              },
              {
                blockType: 'propertySearch',
                heading: 'Local Insight. National Scale.',
                description: 'Headquartered in the Southeast, our brokers and partners support commercial activity across state lines and sector boundaries.',
                buttonText: 'Explore Properties by Market',
                propertiesCount: '99 Properties For Sale in or near Aiken',
              },
              {
                blockType: 'agentCarousel',
                preHeading: 'Meet Our Agents',
                heading: 'Experience that Performs',
                description: "We're proud to bring a wealth of knowledge and relational capital to every deal and partnership.",
                linkText: 'Find an Agent',
                linkHref: '#',
                agents: [
                  {
                    name: 'Jane Smith',
                    role: 'Agent',
                    location: 'Augusta',
                    // Note: image needs to be uploaded separately in admin panel
                  },
                  {
                    name: 'Jordan Collier',
                    role: 'Agent & Broker',
                    location: 'Augusta',
                    // Note: image needs to be uploaded separately in admin panel
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        blockType: 'ctaFooter',
        heading: 'Ready to make your next move?',
        buttons: [
          { label: 'Schedule a Consultation', variant: 'primary' as const },
          { label: 'Get Matched with a Agent', variant: 'secondary' as const },
          { label: 'Search Listings', variant: 'secondary' as const },
        ],
      },
      {
        blockType: 'footer',
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
    const { seedCSSStyles, seedNavbar } = await import('../seed-utils')
    
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

