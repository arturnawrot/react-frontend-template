import { NextResponse } from 'next/server'
import { buildoutApi } from '@/utils/buildout-api'

export async function POST(request: Request) {
  try {
    // Clear the cache
    buildoutApi.clearCache()

    return NextResponse.json({
      success: true,
      message: 'Buildout API cache cleared successfully',
    })
  } catch (error) {
    console.error('Error clearing Buildout cache:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while clearing cache'
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

