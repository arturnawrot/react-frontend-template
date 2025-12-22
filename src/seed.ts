import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const filename = fileURLToPath(import.meta.url)
const dirname_path = dirname(filename)

async function seed() {
  const payload = await getPayload({ config })

  try {
    // Seed CSS styles
    const cssStyles = [
      {
        name: 'Sand Gradient',
        cssClass: 'sand-gradient-background',
        css: `.sand-gradient-background {
  background: radial-gradient(97.87% 101.48% at 97.87% 11.48%, rgba(215, 209, 196, 0.7) 0%, rgba(215, 209, 196, 0.0121075) 72.23%, rgba(215, 209, 196, 0) 100%);
}`,
        active: true,
      },
      {
        name: 'Tan Linear Background',
        cssClass: 'tan-linear-background',
        css: `.tan-linear-background {
  background: linear-gradient(
    360deg,
    rgba(210, 167, 129, 0) 40%,
    rgba(217, 161, 113, 0.1) 100%
  );
}`,
        active: true,
      },
      {
        name: 'Flipped M Background',
        cssClass: 'flipped-m-background',
        css: `.flipped-m-background {
  background: linear-gradient(
    0deg,
    rgba(217, 161, 113, 0) 0%,
    rgba(217, 161, 113, 0.1) 100%
  );
}`,
        active: true,
      },
    ]

    for (const styleData of cssStyles) {
      const existing = await payload.find({
        collection: 'css-styles',
        where: {
          cssClass: {
            equals: styleData.cssClass,
          },
        },
        limit: 1,
      })

      if (existing.docs.length === 0) {
        await payload.create({
          collection: 'css-styles',
          data: styleData,
        })
        console.log(`✅ Created CSS style: ${styleData.name}`)
      } else {
        console.log(`⏭️  CSS style already exists: ${styleData.name}`)
      }
    }

    // Upload amazon_fc.png image to media collection
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
        const imagePath = join(dirname_path, '..', 'public', 'img', 'amazon_fc.png')
        
        const uploadedImage = await payload.create({
          collection: 'media',
          data: {
            alt: '.',
          },
          filePath: imagePath,
        })

        amazonImageId = uploadedImage.id
        console.log('✅ Uploaded amazon_fc.png to media collection')
      } catch (error) {
        console.error('❌ Error uploading amazon_fc.png:', error)
        console.log('⚠️  Continuing without image...')
      }
    }

    // Get Tan Linear Background CSS style (should have been created above)
    let tanLinearStyleId: string | null = null
    const tanLinearStyle = await payload.find({
      collection: 'css-styles',
      where: {
        cssClass: {
          equals: 'tan-linear-background',
        },
      },
      limit: 1,
    })

    if (tanLinearStyle.docs.length > 0) {
      tanLinearStyleId = tanLinearStyle.docs[0].id
    } else {
      console.error('❌ Tan Linear Background CSS style not found!')
    }

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
        cssStyle: tanLinearStyleId,
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

      console.log('✅ Page updated successfully!')
    } else {
      console.log('Creating new page...')

      await payload.create({
        collection: 'pages',
        data: {
          title: 'Home',
          slug: 'home',
          blocks: pageBlocks,
        },
      })

      console.log('✅ Page created successfully!')
    }

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seed()

