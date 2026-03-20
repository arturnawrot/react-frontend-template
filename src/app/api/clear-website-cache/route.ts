import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { headers as getHeaders } from 'next/headers'

export async function POST(_request: Request) {
  try {
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: await getHeaders() })

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Revalidate all pages
    revalidatePath('/', 'layout')

    return NextResponse.json({
      success: true,
      message: 'Website cache cleared successfully',
    })
  } catch (error) {
    console.error('Error clearing website cache:', error)

    const errorMessage =
      error instanceof Error ? error.message : 'An error occurred while clearing cache'

    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
