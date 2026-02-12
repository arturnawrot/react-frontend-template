import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'meybohm_site_unlocked'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      )
    }

    // Fetch the site lock settings server-side
    const payload = await getPayload({ config: payloadConfig })
    const siteLock = await payload.findGlobal({
      slug: 'siteLock',
      depth: 0,
    })

    if (!siteLock.enabled) {
      return NextResponse.json(
        { success: false, error: 'Site lock is not enabled' },
        { status: 400 }
      )
    }

    // Secure comparison
    if (password === siteLock.password) {
      // Set HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set(COOKIE_NAME, 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { success: false, error: 'Incorrect password' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Site lock verification error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}
