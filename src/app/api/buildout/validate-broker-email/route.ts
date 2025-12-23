import { NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Fetch broker ID from Buildout API
    const brokerId = await buildoutApi.findBrokerIdByEmail(email)

    if (!brokerId) {
      return NextResponse.json(
        { error: 'No broker found with this email address', brokerId: null },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      brokerId,
      email,
    })
  } catch (error) {
    console.error('Error validating broker email:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while validating email'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

