import type { Payload } from 'payload'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname_path = dirname(filename)

/**
 * Seeds Jordan Collier agent
 * This function can be called from the main seed.ts or run independently
 */
export async function seedJordanCollier(payload: Payload) {
  try {
    console.log('Seeding Jordan Collier agent...')

    // Upload background image to media collection
    let backgroundImageId: string | null = null
    const imageFilename = 'jordan-collier-1.jpg'
    const existingImage = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: imageFilename,
        },
      },
      limit: 1,
    })

    if (existingImage.docs.length > 0) {
      backgroundImageId = existingImage.docs[0].id
      console.log(`⏭️  Background image ${imageFilename} already exists in media`)
    } else {
      try {
        // Try jordan-collier-1.jpg first, then jordan-collier.jpg
        let imagePath = join(dirname_path, '..', '..', 'public', 'img', 'agents', 'jordan-collier-1.jpg')
        if (!existsSync(imagePath)) {
          imagePath = join(dirname_path, '..', '..', 'public', 'img', 'agents', 'jordan-collier.jpg')
        }

        if (!existsSync(imagePath)) {
          console.error(`❌ Image file not found at ${imagePath}`)
          throw new Error('Image file not found')
        }

        const uploadedImage = await payload.create({
          collection: 'media',
          data: {
            alt: 'jordan-collier-background-image',
          },
          filePath: imagePath,
        })

        backgroundImageId = uploadedImage.id
        console.log(`✅ Uploaded ${imageFilename} to media collection`)
      } catch (error) {
        console.error(`❌ Error uploading ${imageFilename}:`, error)
        console.log('⚠️  Continuing without background image...')
      }
    }

    // Check if agent with slug 'jordan-collier' already exists
    const existingAgent = await payload.find({
      collection: 'agents',
      where: {
        slug: {
          equals: 'jordan-collier',
        },
      },
      limit: 1,
    })

    const agentData = {
      firstName: 'Jordan',
      lastName: 'Collier',
      slug: 'jordan-collier',
      backgroundImage: backgroundImageId,
      roles: [
        {
          role: 'Buyer Rep',
        },
        {
          role: 'Tenant Rep',
        },
        {
          role: 'Dispositions',
        },
      ],
      specialties: [
        {
          specialty: 'Land',
        },
        {
          specialty: 'Retail',
        },
        {
          specialty: 'STNL',
        },
        {
          specialty: 'Industrial',
        },
      ],
      servingLocations: [
        {
          location: 'Augusta',
        },
        {
          location: 'Savannah',
        },
        {
          location: 'Statesboro',
        },
      ],
      about: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Lorem ipsum dolor sit amet consectetur. Nullam in dignissim mattis posuere placerat. Sagittis elementum sit aliquet senectus in. Proin mi tellus mollis massa eros porttitor mauris vivamus. Habitasse sit vulputate enim placerat quis.',
                  type: 'text',
                  version: 1,
                },
                {
                  type: 'linebreak',
                  version: 1,
                },
                {
                  type: 'linebreak',
                  version: 1,
                },
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Arcu aliquam pretium eu dis urna nibh egestas fringilla. Posuere tincidunt felis ut donec tincidunt. Sit leo at arcu egestas gravida id nisi ut in. Dolor urna nisl pellentesque odio in risus diam. Tempus at a molestie fames. Auctor ornare ipsum vitae lectus facilisis nunc ut vitae feugiat. Nec quam a vitae id. Eget nibh consectetur fermentum mauris mollis cursus ultrices molestie erat.',
                  type: 'text',
                  version: 1,
                },
                {
                  type: 'linebreak',
                  version: 1,
                },
                {
                  type: 'linebreak',
                  version: 1,
                },
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Cursus massa ornare ut fermentum faucibus nec in arcu aliquam. Pellentesque gravida tristique tellus senectus ut quis. Etiam malesuada senectus eget cras urna cras rhoncus posuere turpis. In volutpat nisl facilisis pellentesque pulvinar. Et odio nulla feugiat in id lectus consequat vitae id.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'paragraph',
              version: 1,
              textFormat: 0,
              textStyle: '',
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          type: 'root',
          version: 1,
        },
      },
      email: 'jcollier@meybohm.com',
      phone: '7063143953',
      linkedin: 'https://linkedin.com/jordancollier',
      buildout_broker_id: '26043',
      featuredPropertyIds: [1448914, 1496302, 396026, 1507454],
    }

    if (existingAgent.docs.length > 0) {
      console.log('Agent with slug "jordan-collier" already exists. Updating...')

      await payload.update({
        collection: 'agents',
        id: existingAgent.docs[0].id,
        data: agentData,
      })

      console.log('✅ Jordan Collier agent updated successfully!')
    } else {
      console.log('Creating new Jordan Collier agent...')

      await payload.create({
        collection: 'agents',
        data: agentData,
      })

      console.log('✅ Jordan Collier agent created successfully!')
    }
  } catch (error) {
    console.error('❌ Error seeding Jordan Collier agent:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:jordan-collier
// Check if this file is being run directly (not imported)
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-jordan-collier.ts') ||
  process.argv[1]?.includes('seed-jordan-collier')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedJordanCollier(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}

