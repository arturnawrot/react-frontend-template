import type { Payload } from 'payload'
import { buildoutApi } from '../utils/buildout-api'
import { slugify } from '../utils/slugify'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { tmpdir } from 'os'

/**
 * Downloads an image from a URL and saves it to a temporary file
 */
async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`)
  }
  const buffer = await response.arrayBuffer()
  await writeFile(filepath, Buffer.from(buffer))
}

/**
 * Uploads an image from a URL to Payload media collection
 * Returns the media ID or null if upload fails
 */
async function uploadImageFromUrl(
  payload: Payload,
  imageUrl: string | null,
  altText: string,
  filename: string
): Promise<string | null> {
  if (!imageUrl) {
    return null
  }

  try {
    // Check if image already exists
    const existingImage = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    })

    if (existingImage.docs.length > 0) {
      return existingImage.docs[0].id
    }

    // Create temp directory if it doesn't exist
    const tempDir = join(tmpdir(), 'payload-seed')
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true })
    }

    // Download image to temp file
    const tempFilePath = join(tempDir, filename)
    await downloadImage(imageUrl, tempFilePath)

    // Upload to Payload
    const uploadedImage = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      filePath: tempFilePath,
    })

    // Clean up temp file
    try {
      await unlink(tempFilePath)
    } catch (error) {
      // Ignore cleanup errors
      console.warn(`⚠️  Could not delete temp file ${tempFilePath}:`, error)
    }

    return uploadedImage.id
  } catch (error) {
    console.error(`❌ Error uploading image ${imageUrl}:`, error)
    return null
  }
}


/**
 * Creates or finds a specialty record and returns its ID
 */
async function getOrCreateSpecialty(payload: Payload, specialtyName: string): Promise<string | null> {
  if (!specialtyName || !specialtyName.trim()) {
    return null
  }

  const name = specialtyName.trim()
  
  // Try to find existing specialty
  const existing = await payload.find({
    collection: 'specialties',
    where: {
      name: {
        equals: name,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }

  // Create new specialty
  try {
    const created = await payload.create({
      collection: 'specialties',
      data: {
        name,
        slug: slugify(name),
      },
      draft: false,
    })
    return created.id
  } catch (error) {
    console.error(`❌ Error creating specialty "${name}":`, error)
    return null
  }
}

/**
 * Converts buildout specialties array to Payload specialty relationship IDs
 * Processes all specialties from broker.specialties array
 */
async function convertSpecialties(payload: Payload, specialties: string[]): Promise<string[]> {
  const specialtyIds: string[] = []
  
  if (!specialties || specialties.length === 0) {
    return specialtyIds
  }
  
  for (const specialty of specialties) {
    // Skip empty strings
    if (!specialty || !specialty.trim()) {
      continue
    }
    
    const id = await getOrCreateSpecialty(payload, specialty)
    if (id) {
      specialtyIds.push(id)
    }
  }
  
  return specialtyIds
}

/**
 * Creates or finds a role record and returns its ID
 */
async function getOrCreateRole(payload: Payload, roleName: string): Promise<string | null> {
  if (!roleName || !roleName.trim()) {
    return null
  }

  const name = roleName.trim()
  
  // Try to find existing role
  const existing = await payload.find({
    collection: 'roles',
    where: {
      name: {
        equals: name,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }

  // Create new role
  try {
    const created = await payload.create({
      collection: 'roles',
      data: {
        name,
        slug: slugify(name),
      },
      draft: false,
    })
    return created.id
  } catch (error) {
    console.error(`❌ Error creating role "${name}":`, error)
    return null
  }
}

/**
 * Converts buildout job_title to Payload role relationship IDs
 */
async function convertRoles(payload: Payload, jobTitle: string | null): Promise<string[]> {
  const roleIds: string[] = []
  
  if (jobTitle && jobTitle.trim()) {
    // Try to create/find role from job title
    const id = await getOrCreateRole(payload, jobTitle.trim())
    if (id) {
      roleIds.push(id)
    }
  }
  
  // Default to "Agent & Broker" if no job title
  if (roleIds.length === 0) {
    const defaultRoleId = await getOrCreateRole(payload, 'Agent & Broker')
    if (defaultRoleId) {
      roleIds.push(defaultRoleId)
    }
  }
  
  return roleIds
}

/**
 * Creates or finds a serving location record and returns its ID
 */
async function getOrCreateServingLocation(payload: Payload, locationName: string): Promise<string | null> {
  if (!locationName || !locationName.trim()) {
    return null
  }

  const name = locationName.trim()
  
  // Try to find existing location
  const existing = await payload.find({
    collection: 'serving-locations',
    where: {
      name: {
        equals: name,
      },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return existing.docs[0].id
  }

  // Create new location
  try {
    const created = await payload.create({
      collection: 'serving-locations',
      data: {
        name,
        slug: slugify(name),
      },
    })
    return created.id
  } catch (error) {
    console.error(`❌ Error creating serving location "${name}":`, error)
    return null
  }
}

/**
 * Converts buildout city/state to serving location relationship IDs
 */
async function convertServingLocations(payload: Payload, city: string, _state: string): Promise<string[]> {
  const locationIds: string[] = []
  
  if (city && city.trim()) {
    const id = await getOrCreateServingLocation(payload, city.trim())
    if (id) {
      locationIds.push(id)
    }
  }
  
  return locationIds
}

/**
 * Gets random 4 property IDs for a broker
 */
async function getRandomFeaturedProperties(brokerId: number): Promise<number[]> {
  try {
    const propertiesResponse = await buildoutApi.getPropertiesByBrokerId(brokerId, {
      skipCache: false,
      limit: 100, // Get up to 100 properties to choose from
    })

    const propertyIds = propertiesResponse.properties
      .filter((p) => p.id)
      .map((p) => p.id)
      .filter((id): id is number => typeof id === 'number')

    if (propertyIds.length === 0) {
      return []
    }

    // Shuffle and pick 4
    const shuffled = [...propertyIds].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(4, shuffled.length))
  } catch (error) {
    console.error(`❌ Error getting properties for broker ${brokerId}:`, error)
    return []
  }
}

/**
 * Seeds all brokers from Buildout API
 */
export async function seedBrokers(payload: Payload) {
  try {
    console.log('🌱 Starting broker seed...')

    // Check if agents already exist
    const existingAgents = await payload.find({
      collection: 'agents',
      limit: 1,
    })

    if (existingAgents.docs.length > 0) {
      console.log('⏭️  Agents already exist. Skipping broker seed.')
      return
    }

    // Fetch all brokers from Buildout
    console.log('📥 Fetching brokers from Buildout API...')
    const brokersResponse = await buildoutApi.getAllBrokers({ skipCache: false })
    const brokers = brokersResponse.brokers

    console.log(`📊 Found ${brokers.length} brokers to process`)

    let created = 0
    let updated = 0
    let skipped = 0
    let errors = 0

    for (const broker of brokers) {
      try {
        // Skip brokers without essential data
        if (!broker.first_name || !broker.last_name || !broker.email) {
          console.log(`⏭️  Skipping broker ${broker.id} - missing essential data`)
          skipped++
          continue
        }

        const slug = `${slugify(broker.first_name)}-${slugify(broker.last_name)}`
        console.log(`\n👤 Processing: ${broker.first_name} ${broker.last_name} (${slug})`)

        // Check if agent already exists
        const existingAgent = await payload.find({
          collection: 'agents',
          where: {
            or: [
              {
                slug: {
                  equals: slug,
                },
              },
              {
                buildout_broker_id: {
                  equals: String(broker.id),
                },
              },
            ],
          },
          limit: 1,
        })

        // Upload profile photo
        let imageId: string | null = null
        if (broker.profile_photo_url) {
          const imageFilename = `broker-${broker.id}-${slug}.${broker.profile_photo_url.split('.').pop()?.split('?')[0] || 'jpg'}`
          console.log(`  📸 Downloading profile photo...`)
          imageId = await uploadImageFromUrl(
            payload,
            broker.profile_photo_url,
            `${broker.first_name} ${broker.last_name} profile photo`,
            imageFilename
          )
          if (imageId) {
            console.log(`  ✅ Profile photo uploaded`)
          } else {
            console.log(`  ⚠️  Could not upload profile photo`)
          }
        }

        // Get random featured properties
        console.log(`  🏠 Getting featured properties...`)
        const featuredPropertyIds = await getRandomFeaturedProperties(broker.id)
        console.log(`  ✅ Found ${featuredPropertyIds.length} featured properties`)

        // Convert specialties
        console.log(`  🏷️  Processing specialties...`)
        console.log(`  📋 Buildout specialties:`, broker.specialties || [])
        const specialtyIds = await convertSpecialties(payload, broker.specialties || [])
        console.log(`  ✅ Found ${specialtyIds.length} specialties:`, specialtyIds)

        // Convert serving locations
        console.log(`  📍 Processing serving locations...`)
        const servingLocationIds = await convertServingLocations(payload, broker.city || '', broker.state || '')
        console.log(`  ✅ Found ${servingLocationIds.length} serving locations`)

        // Convert roles
        console.log(`  👔 Processing roles...`)
        const roleIds = await convertRoles(payload, broker.job_title || null)
        console.log(`  ✅ Found ${roleIds.length} roles`)

        // Prepare agent data
        // Always set relationship arrays (even if empty) to ensure proper updates
        const agentData: any = {
          firstName: broker.first_name,
          lastName: broker.last_name,
          slug,
          email: broker.email || null,
          phone: broker.phone_number || broker.cell_phone || null,
          linkedin: broker.linked_in_url || null,
          buildout_broker_id: String(broker.id),
          featuredPropertyIds: featuredPropertyIds.length > 0 ? featuredPropertyIds : undefined,
          specialties: specialtyIds, // Always set the array, even if empty
          servingLocations: servingLocationIds, // Always set the array, even if empty
          roles: roleIds, // Always set the array, even if empty
        }

        // Add images if available
        if (imageId) {
          agentData.backgroundImage = imageId
          agentData.cardImage = imageId
        }

        // Add biography if available
        if (broker.biography) {
          // Convert biography to Lexical format
          agentData.about = {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: broker.biography,
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: null,
                  format: '' as '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                  textFormat: 0,
                  textStyle: '',
                },
              ],
              direction: null,
              format: '' as '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify',
              indent: 0,
              type: 'root',
              version: 1,
            },
          }
        }

        if (existingAgent.docs.length > 0) {
          console.log(`  🔄 Updating existing agent...`)
          console.log(`  📝 Agent data specialties:`, agentData.specialties)
          await payload.update({
            collection: 'agents',
            id: existingAgent.docs[0].id,
            data: agentData,
          })
          updated++
          console.log(`  ✅ Agent updated successfully!`)
        } else {
          console.log(`  ➕ Creating new agent...`)
          console.log(`  📝 Agent data specialties:`, agentData.specialties)
          await payload.create({
            collection: 'agents',
            data: agentData,
          })
          created++
          console.log(`  ✅ Agent created successfully!`)
        }
      } catch (error) {
        console.error(`  ❌ Error processing broker ${broker.id}:`, error)
        errors++
      }
    }

    console.log(`\n✅ Broker seed completed!`)
    console.log(`   Created: ${created}`)
    console.log(`   Updated: ${updated}`)
    console.log(`   Skipped: ${skipped}`)
    console.log(`   Errors: ${errors}`)
  } catch (error) {
    console.error('❌ Error seeding brokers:', error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:brokers
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-brokers.ts') ||
  process.argv[1]?.includes('seed-brokers')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedBrokers(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}

