interface AnalyticsEvent {
  event: string
  variant?: 'A' | 'B'
  properties?: Record<string, any>
  timestamp: number
  sessionId: string
}

class SimpleAnalytics {
  private events: AnalyticsEvent[] = []
  private sessionId: string = ''

  constructor() {
    if (typeof window !== 'undefined') {
      this.sessionId = this.getOrCreateSessionId()
    }
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem('analytics-session-id')
    if (!sessionId) {
      sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
      localStorage.setItem('analytics-session-id', sessionId)
    }
    return sessionId
  }

  // Track events locally (can be sent to backend later)
  track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      variant: properties.variant,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId
    }

    this.events.push(analyticsEvent)
    console.log('📊 Analytics Event:', analyticsEvent)

    // Store in localStorage for persistence
    const storedEvents = JSON.parse(localStorage.getItem('analytics-events') || '[]')
    storedEvents.push(analyticsEvent)
    localStorage.setItem('analytics-events', JSON.stringify(storedEvents.slice(-100))) // Keep last 100 events

    // Optional: Send to backend API
    this.sendToBackend(analyticsEvent).catch(console.error)
  }

  private async sendToBackend(event: AnalyticsEvent) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event)
      })
    } catch (error) {
      // Fail silently - analytics shouldn't break UX
    }
  }

  // Get all tracked events
  getEvents(): AnalyticsEvent[] {
    return this.events
  }

  // Get events from localStorage
  getStoredEvents(): AnalyticsEvent[] {
    if (typeof window === 'undefined') return []
    return JSON.parse(localStorage.getItem('analytics-events') || '[]')
  }
}

// Export singleton instance
export const analytics = new SimpleAnalytics()
