import type { Payload } from 'payload'

/**
 * Seeds the default FAQ set with sample questions and answers
 */
export async function seedFAQSets(payload: Payload) {
  try {
    console.log('🌱 Seeding FAQ sets...')

    // Default FAQ questions and answers
    const defaultQuestions = [
      {
        question: 'How is value determined.',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Answer',
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
      },
      {
        question: 'Can I sell off-market?',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Answer',
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
      },
      {
        question: "What's included in the listing package?",
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Answer',
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
      },
      {
        question: 'How quickly can we go to market?',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Answer',
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
      },
    ]

    // Get or create the global
    const global = await payload.findGlobal({
      slug: 'faqSets',
    })

    // Prepare sets array
    let sets: Array<{
      name: string
      questions: Array<{
        question: string
        answer: {
          root: {
            children: any[]
            direction: null
            format: string
            indent: number
            type: string
            version: number
          }
        }
      }>
    }> = []

    if (global?.sets && Array.isArray(global.sets)) {
      sets = global.sets.map((set: any) => ({
        name: set.name,
        questions: Array.isArray(set.questions)
          ? set.questions.map((q: any) => ({
              question: q.question || '',
              answer: q.answer || {
                root: {
                  children: [
                    {
                      children: [
                        {
                          detail: 0,
                          format: 0,
                          mode: 'normal',
                          style: '',
                          text: '',
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
        questions: defaultQuestions,
      }
      console.log('🔄 Updated existing "default" FAQ set')
    } else {
      // Create new default set
      sets = [
        {
          name: 'default',
          questions: defaultQuestions,
        },
        ...sets, // Add any existing sets after default
      ]
      console.log('➕ Created new "default" FAQ set')
    }

    // Update the global
    await payload.updateGlobal({
      slug: 'faqSets',
      data: {
        sets,
      },
    })

    console.log('✅ FAQ sets seeded successfully!')
    console.log(`   Default set contains ${defaultQuestions.length} questions`)
  } catch (error) {
    console.error('❌ Error seeding FAQ sets:', error)
    throw error
  }
}

// Allow running this file directly
const isMainModule =
  import.meta.url === `file://${process.argv[1]?.replace(/\\/g, '/')}` ||
  process.argv[1]?.includes('seed-faq-sets.ts') ||
  process.argv[1]?.includes('seed-faq-sets')

if (isMainModule) {
  import('dotenv/config').then(async () => {
    const { default: config } = await import('../payload.config')
    const { getPayload } = await import('payload')

    const payload = await getPayload({ config })

    try {
      await seedFAQSets(payload)
      process.exit(0)
    } catch (error) {
      console.error('❌ Error:', error)
      process.exit(1)
    }
  })
}
