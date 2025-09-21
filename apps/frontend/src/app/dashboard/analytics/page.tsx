'use client'

import { useEffect, useState } from 'react'
import { analytics } from '@/lib/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AnalyticsSummary {
  totalEvents: number
  variantA: number
  variantB: number
  ctaClicks: number
  pageViews: number
  recentEvents: any[]
}

export default function AnalyticsDashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null)
  const [localEvents, setLocalEvents] = useState<any[]>([])

  useEffect(() => {
    // Fetch from backend API
    fetchAnalytics()
    
    // Get local events from localStorage
    const events = analytics.getStoredEvents()
    setLocalEvents(events)
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/track')
      const data = await response.json()
      setSummary(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    }
  }

  const variantAPercentage = summary ? 
    (summary.variantA / (summary.variantA + summary.variantB) * 100) || 0 : 0

  const variantBPercentage = summary ? 
    (summary.variantB / (summary.variantA + summary.variantB) * 100) || 0 : 0

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">📊 Simple Analytics Dashboard</h2>
        <p className="text-gray-600">Track your A/B test performance in real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalEvents || localEvents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.pageViews || localEvents.filter(e => e.event === 'page_view').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CTA Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.ctaClicks || localEvents.filter(e => e.event === 'cta_click').length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.pageViews && summary?.ctaClicks ? 
                ((summary.ctaClicks / summary.pageViews) * 100).toFixed(1) + '%' : 
                localEvents.filter(e => e.event === 'page_view').length > 0 ?
                  ((localEvents.filter(e => e.event === 'cta_click').length / localEvents.filter(e => e.event === 'page_view').length) * 100).toFixed(1) + '%' :
                  '0%'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* A/B Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Variant A Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Views:</span>
                <span className="font-bold">{summary?.variantA || localEvents.filter(e => e.properties?.variant === 'A').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Traffic Share:</span>
                <span className="font-bold">{variantAPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${variantAPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 italic">
                "Eco-Friendly Water Bottle For a Greener Tomorrow"
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variant B Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Views:</span>
                <span className="font-bold">{summary?.variantB || localEvents.filter(e => e.properties?.variant === 'B').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Traffic Share:</span>
                <span className="font-bold">{variantBPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${variantBPercentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 italic">
                "Hydrate Better. Save the Planet."
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {(summary?.recentEvents || localEvents.slice(-10).reverse()).map((event, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                <span className="font-medium">{event.event}</span>
                <span className="text-gray-600">
                  {event.properties?.variant && `Variant ${event.properties.variant} • `}
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
