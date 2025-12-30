# Redis Setup for Buildout Cache

The Buildout API cache now uses Redis for shared caching across all serverless instances. This ensures that cache clearing works properly in distributed environments.

## Setup

### 1. Install Dependencies

```bash
pnpm add ioredis
```

### 2. Configure Redis URL

Add the `REDIS_URL` environment variable to your `.env` file:

```env
REDIS_URL=redis://localhost:6379
```

For production (e.g., Vercel, Railway, Upstash):

```env
# Upstash Redis
REDIS_URL=rediss://default:YOUR_PASSWORD@YOUR_ENDPOINT.upstash.io:6379

# Railway Redis
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_ENDPOINT.railway.app:6379

# Vercel KV (if using Vercel KV)
REDIS_URL=redis://default:YOUR_PASSWORD@YOUR_ENDPOINT.vercel-storage.com:6379
```

### 3. Local Development with Docker

If you want to run Redis locally with Docker, add this to your `docker-compose.yml`:

```yaml
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  redis_data:
```

Then update your `.env`:
```env
REDIS_URL=redis://redis:6379
```

## How It Works

1. **Cache Storage**: All Buildout API responses are stored in Redis with TTL (Time To Live) based on `BUILDOUT_CACHE_TTL` (default: 3600 seconds).

2. **Cache Keys**:
   - `buildout:properties` - All properties data
   - `buildout:brokers` - All brokers data

3. **Cache Clearing**: The "Clear Buildout Cache" button now:
   - Deletes all `buildout:*` keys from Redis
   - Revalidates Next.js route caches
   - Works across all serverless instances

## Fallback Behavior

If `REDIS_URL` is not set:
- Cache is disabled
- All API calls will fetch fresh data from Buildout API
- A warning is logged in development mode

## Testing

After setting up Redis, test the cache:

1. Make an API call (e.g., fetch properties)
2. Make the same call again (should be faster - cached)
3. Click "Clear Buildout Cache" button
4. Make the call again (should fetch fresh data)

## Production Considerations

- **Memory Usage**: Redis stores JSON-serialized data. Monitor Redis memory usage.
- **Connection Pooling**: The Redis client uses connection pooling automatically.
- **Error Handling**: If Redis is unavailable, the system falls back to no caching (fresh API calls).
- **TTL**: Cache entries expire automatically after `BUILDOUT_CACHE_TTL` seconds.

