import { NextRequest, NextResponse } from 'next/server'

interface AnalyticsEvent {
  event: string
  variant?: 'A' | 'B'
  properties?: Record<string, any>
  timestamp: number
  sessionId: string
}

// in-memory storage (replace with database in production)
const events: AnalyticsEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const event: AnalyticsEvent = await request.json()
    
    // Store event (in production, save to database)
    events.push(event)
    console.log('📊 Analytics Event Received:', event)

    // Log A/B test events specifically
    if (event.properties?.variant) {
      console.log(`🧪 A/B Test Event: ${event.event} - Variant ${event.properties.variant}`)
    }

    return NextResponse.json({ success: true, eventId: events.length })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track event' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Get analytics summary
  const summary = {
    totalEvents: events.length,
    variantA: events.filter(e => e.properties?.variant === 'A').length,
    variantB: events.filter(e => e.properties?.variant === 'B').length,
    ctaClicks: events.filter(e => e.event === 'cta_click').length,
    pageViews: events.filter(e => e.event === 'page_view').length,
    recentEvents: events.slice(-10) // Last 10 events
  }

  return NextResponse.json(summary)
}
