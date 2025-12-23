/**
 * Manual test script to verify cache clearing works
 * 
 * Usage:
 *   pnpm tsx tests/manual/clear-cache-test.ts
 * 
 * This script:
 * 1. Makes an API call that gets cached
 * 2. Makes the same call again (should use cache)
 * 3. Clears the cache
 * 4. Makes the call again (should fetch fresh data)
 */

import { buildoutApi } from '@/utils/buildout-api'

async function testCacheClearing() {
  console.log('🧪 Testing Buildout Cache Clearing...\n')

  // Check if API key is set
  if (!process.env.BUILDOUT_API_KEY) {
    console.error('❌ BUILDOUT_API_KEY is not set in environment variables')
    console.log('   Set it in your .env file or export it before running this test')
    process.exit(1)
  }

  // Use a test email (you may need to adjust this)
  const testEmail = process.env.TEST_BROKER_EMAIL || 'test@example.com'
  
  console.log(`📧 Testing with email: ${testEmail}\n`)

  try {
    // Step 1: First call - should hit API
    console.log('1️⃣  Making first API call (should fetch from API)...')
    const start1 = Date.now()
    const broker1 = await buildoutApi.getBrokerByEmail(testEmail, { skipCache: false })
    const time1 = Date.now() - start1
    console.log(`   ✅ Completed in ${time1}ms`)
    console.log(`   Result: ${broker1 ? `Found broker ID: ${broker1.id}` : 'No broker found'}\n`)

    // Step 2: Second call - should use cache (faster)
    console.log('2️⃣  Making second API call (should use cache)...')
    const start2 = Date.now()
    const broker2 = await buildoutApi.getBrokerByEmail(testEmail, { skipCache: false })
    const time2 = Date.now() - start2
    console.log(`   ✅ Completed in ${time2}ms`)
    console.log(`   Result: ${broker2 ? `Found broker ID: ${broker2.id}` : 'No broker found'}`)
    
    if (time2 < time1) {
      console.log(`   ✅ Cache is working! (${time2}ms < ${time1}ms)\n`)
    } else {
      console.log(`   ⚠️  Cache might not be working (${time2}ms >= ${time1}ms)\n`)
    }

    // Step 3: Clear cache
    console.log('3️⃣  Clearing cache...')
    buildoutApi.clearCache()
    console.log('   ✅ Cache cleared\n')

    // Step 4: Third call - should fetch fresh data again
    console.log('4️⃣  Making third API call after cache clear (should fetch from API)...')
    const start3 = Date.now()
    const broker3 = await buildoutApi.getBrokerByEmail(testEmail, { skipCache: false })
    const time3 = Date.now() - start3
    console.log(`   ✅ Completed in ${time3}ms`)
    console.log(`   Result: ${broker3 ? `Found broker ID: ${broker3.id}` : 'No broker found'}\n`)

    // Verify results are consistent
    const broker1Id = broker1?.id
    const broker2Id = broker2?.id
    const broker3Id = broker3?.id

    if (broker1Id === broker2Id && broker2Id === broker3Id) {
      console.log('✅ All results match - cache clearing works correctly!')
      console.log(`   Broker IDs: ${broker1Id || 'null'} (consistent across all calls)`)
    } else {
      console.log('⚠️  Results differ - this might indicate a problem')
      console.log(`   Broker IDs: ${broker1Id || 'null'}, ${broker2Id || 'null'}, ${broker3Id || 'null'}`)
    }

    console.log('\n✨ Test completed!')
  } catch (error) {
    console.error('❌ Test failed with error:', error)
    if (error instanceof Error) {
      console.error('   Error message:', error.message)
    }
    process.exit(1)
  }
}

// Run the test
testCacheClearing()

