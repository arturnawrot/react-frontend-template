import { NextResponse } from 'next/server'
import { purgeAllCaches } from '@/utils/purge-caches'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.CRON_SECRET

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await purgeAllCaches()

    return NextResponse.json({
      success: true,
      message: 'All caches purged successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error in cron purge-caches:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while purging caches'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
