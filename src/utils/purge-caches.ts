import { revalidatePath } from 'next/cache'
import { buildoutApi } from '@/utils/buildout-api'

/**
 * Purges all caches: Buildout (Redis + Next.js route caches) and website (Next.js page cache).
 */
export async function purgeAllCaches(): Promise<void> {
  // Clear Buildout API caches (Redis + route caches + cache tags)
  await buildoutApi.clearCache()

  // Clear all Next.js page caches
  revalidatePath('/', 'layout')

  console.log('[purgeAllCaches] All caches purged (Buildout + website)')
}
