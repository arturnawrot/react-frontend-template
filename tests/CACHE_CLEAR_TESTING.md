# Testing the Clear Cache Button

This document explains how to verify that the clear cache button works correctly.

## Quick Test Methods

### Method 1: Run Automated Tests (Recommended)

Run the integration tests:

```bash
pnpm test:int -- tests/int/buildout-cache.int.spec.ts
```

Or run all integration tests:

```bash
pnpm test:int
```

### Method 2: Manual Test Script

Run the manual test script that simulates cache behavior:

```bash
pnpm test:cache
```

This will:
1. Make an API call (gets cached)
2. Make the same call again (uses cache - faster)
3. Clear the cache
4. Make the call again (fetches fresh - slower)

### Method 3: Manual Browser Test

1. **Open the Payload Admin Panel** where the Clear Buildout Cache button is located
2. **Open Browser DevTools** → Network tab
3. **Make a request** that uses Buildout API (e.g., view a page that fetches broker data)
4. **Note the response time** of the Buildout API call
5. **Make the same request again** - should be faster (cached)
6. **Click "Clear Buildout Cache" button**
7. **Make the request again** - should be slower again (fresh fetch)

### Method 4: Test via API Endpoint Directly

Test the API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/buildout/clear-cache
```

Expected response:
```json
{
  "success": true,
  "message": "Buildout API cache cleared successfully"
}
```

## What the Tests Verify

### Integration Tests (`tests/int/buildout-cache.int.spec.ts`)

1. **API Route Test**
   - ✅ POST request to `/api/buildout/clear-cache` returns success
   - ✅ Error handling works correctly

2. **Cache Functionality Test**
   - ✅ Cache can be cleared without errors
   - ✅ After clearing cache, subsequent API calls fetch fresh data
   - ✅ Multiple cache clears work correctly

### Manual Test Script (`tests/manual/clear-cache-test.ts`)

- ✅ Verifies actual cache behavior with real API calls
- ✅ Measures response times to confirm cache is working
- ✅ Confirms cache clearing forces fresh API calls

## Expected Behavior

### Before Clearing Cache

1. First API call: ~200-500ms (network request)
2. Second API call: ~1-10ms (cached, instant)

### After Clearing Cache

1. Cache clear: Instant (< 1ms)
2. Next API call: ~200-500ms again (fresh network request)

## Troubleshooting

### Cache Not Working?

1. Check `BUILDOUT_CACHE_ENABLED` environment variable
   - Should be `true` or not set (defaults to enabled)
   - If set to `false`, cache is disabled

2. Check cache TTL
   - `BUILDOUT_CACHE_TTL` defaults to 3600 seconds (1 hour)
   - Cache entries expire after TTL

3. Verify the button is calling the correct endpoint
   - Should POST to `/api/buildout/clear-cache`

### Tests Failing?

1. Make sure `BUILDOUT_API_KEY` is set in test environment
2. Check that the API endpoint is accessible
3. Verify network connectivity to Buildout API

## Code Locations

- **Component**: `src/components/ClearBuildoutCache/ClearBuildoutCache.tsx`
- **API Route**: `src/app/api/buildout/clear-cache/route.ts`
- **Cache Implementation**: `src/utils/buildout-api.ts` (MemoryCache class)
- **Integration Tests**: `tests/int/buildout-cache.int.spec.ts`
- **Manual Test**: `tests/manual/clear-cache-test.ts`

