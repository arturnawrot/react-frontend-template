import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import { runSeed } from './lib/seed-runner'

// CLI entry point
async function seed() {
  const payload = await getPayload({ config })

  try {
    await runSeed(payload)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    process.exit(1)
  }
}

seed()

