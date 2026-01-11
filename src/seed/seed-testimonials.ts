import type { Payload } from 'payload'

/**
 * Seeds the default testimonials set with sample testimonials
 */
export async function seedTestimonials(payload: Payload) {
  try {
    console.log('🌱 Seeding testimonials sets...')

    // Sample testimonials for the default set
    const defaultTestimonials = [
      {
        quote:
          'Meybohm Commercial provided exceptional service throughout our acquisition process. Their team\'s expertise and attention to detail made all the difference.',
        author: 'John Smith',
        company: 'ABC Corporation',
      },
      {
        quote:
          'Working with Meybohm Commercial was a game-changer for our business. They helped us find the perfect space that aligned with our growth strategy.',
        author: 'Sarah Johnson',
        company: 'XYZ Industries',
      },
      {
        quote:
          'The Meybohm team\'s deep market knowledge and strategic approach helped us achieve better terms than we ever expected. Highly recommended.',
        author: 'Michael Chen',
        company: 'Tech Solutions Inc.',
      },
      {
        quote:
          'From initial consultation to closing, Meybohm Commercial guided us every step of the way. Their partnership approach sets them apart.',
        author: 'Emily Rodriguez',
        company: 'Retail Ventures LLC',
      },
      {
        quote:
          'We\'ve worked with many commercial real estate firms, but Meybohm Commercial stands out for their professionalism and results-driven approach.',
        author: 'David Thompson',
        company: 'Manufacturing Partners',
      },
    ]

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'testimonialsSets',
    })

    // Prepare sets array
    let sets: Array<{
      name: string
      testimonials: Array<{
        quote: string
        author: string
        company?: string
      }>
    }> = []

    if (global?.sets && Array.isArray(global.sets)) {
      sets = global.sets.map((set: any) => ({
        name: set.name,
        testimonials: Array.isArray(set.testimonials)
          ? set.testimonials.map((t: any) => ({
              quote: t.quote || '',
              author: t.author || '',
              company: t.company || undefined,
            }))
          : [],
      }))
    }

    // Check if default set already exists
    const defaultSetIndex = sets.findIndex((set) => set.name === 'default')

    if (defaultSetIndex >= 0) {
      // Update existing default set
      sets[defaultSetIndex] = {
        name: 'default',
        testimonials: defaultTestimonials,
      }
      console.log('🔄 Updated existing "default" testimonials set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          testimonials: defaultTestimonials,
        },
        ...sets, // Add any existing sets after default
      ]
      console.log('➕ Created new "default" testimonials set')
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'testimonialsSets',
      data: {
        sets,
      },
    })

    console.log('✅ Testimonials sets seeded successfully!')
    console.log(`   Default set contains ${defaultTestimonials.length} testimonials`)
  } catch (error) {
    console.error('❌ Error seeding testimonials sets:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-testimonials.ts') ||
  process.argv[1]?.includes('seed-testimonials')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedTestimonials(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
