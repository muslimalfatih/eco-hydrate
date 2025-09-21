import { NextRequest, NextResponse } from 'next/server'
import { register } from '@/lib/metrics'

export async function GET(request: NextRequest) {
  try {
    // Get all metrics in Prometheus format
    const metrics = await register.metrics()
    
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        'Content-Type': register.contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error generating metrics:', error)
    return NextResponse.json(
      { error: 'Failed to generate metrics' },
      { status: 500 }
    )
  }
}
