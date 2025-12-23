import type { Payload } from 'payload'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { getStyleId } from '../seed-utils'

const filename = fileURLToPath(import.meta.url)
const dirname_path = dirname(filename)

/**
 * Seeds the home page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedHomePage(payload: Payload) {
  try {
    console.log('Seeding home page...')

    // Upload amazon_fc-1.png image to media collection
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

    // Get CSS style IDs (should have been created above)
    const tanLinearStyleId = await getStyleId(payload, 'tan-linear-background')
    const mb300StyleId = await getStyleId(payload, '-mb-300')
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
        blockType: 'hero',
        variant: 'default',
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
      },
      {
        blockType: 'container',
        cssStyles: [
          ...(tanLinearStyleId ? [tanLinearStyleId] : []),
          ...(mb300StyleId ? [mb300StyleId] : []),
        ],
        blocks: [
          {
            blockType: 'flippedM',
            heading: 'Built on more than \ntransactions.',
            subheading:
              "We advise with the same care we'd want for our own portfolio. Whether you're investing, expanding, or exiting - we're built for your next move.",
            bulletPoints: [
              {
                title: 'Acquisition support for owner-operators and investors.',
                description:
                  "Whether you're expanding your business or building out your portfolio, we offer the guidance and expertise to transform real estate into lasting prosperity.",
                linkText: 'See All Buying',
                linkHref: '/',
              },
              {
                title: 'Space strategy and tenant representation.',
                description:
                  'Our holistic approach to real estate means we equip you for every facet of ownership and investment - from long-term thinking to immediate solutions.',
                linkText: 'See All Leasing',
                linkHref: '/',
              },
              {
                title: 'Disposition and portfolio exit planning.',
                description:
                  "When it's time to make a strategic exit we have the experience and track-record to guide you towards the best possible returns and tax-friendly options.",
                linkText: 'See All Selling',
                linkHref: '/',
              },
            ],
            image: amazonImageId,
          },
        ],
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
                description:
                  'In every transaction and relationship we hold true to our guiding principles.',
                buttonText: 'What Makes Us Different',
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
        ],
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
    const { seedCSSStyles, seedNavbar } = await import('../seed-utils')
    
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

