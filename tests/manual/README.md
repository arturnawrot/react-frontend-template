# Manual Tests

This directory contains manual test scripts for verifying functionality.

## Clear Cache Test

Tests the Buildout API cache clearing functionality.

### Running the Test

```bash
# Using npm script
pnpm test:cache

# Or directly with tsx
pnpm tsx tests/manual/clear-cache-test.ts
```

### Prerequisites

1. Set `BUILDOUT_API_KEY` in your environment variables (`.env` file)
2. Optionally set `TEST_BROKER_EMAIL` to test with a specific broker email
   - Default: `test@example.com`

### What It Tests

1. **First API call** - Fetches data from Buildout API (uncached)
2. **Second API call** - Should use cached data (faster)
3. **Cache clear** - Clears the in-memory cache
4. **Third API call** - Should fetch fresh data from API again

### Expected Output

```
🧪 Testing Buildout Cache Clearing...

📧 Testing with email: test@example.com

1️⃣  Making first API call (should fetch from API)...
   ✅ Completed in 250ms
   Result: Found broker ID: 123

2️⃣  Making second API call (should use cache)...
   ✅ Completed in 5ms
   Result: Found broker ID: 123
   ✅ Cache is working! (5ms < 250ms)

3️⃣  Clearing cache...
   ✅ Cache cleared

4️⃣  Making third API call after cache clear (should fetch from API)...
   ✅ Completed in 245ms
   Result: Found broker ID: 123

✅ All results match - cache clearing works correctly!
   Broker IDs: 123 (consistent across all calls)

✨ Test completed!
```

### Troubleshooting

- **"BUILDOUT_API_KEY is not set"**: Make sure your `.env` file has the API key
- **Slow cache hits**: The cache might not be working if second call is as slow as first
- **Different broker IDs**: This shouldn't happen, but could indicate API issues

