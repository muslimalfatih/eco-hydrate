'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { analytics } from '@/lib/analytics'
import { DashboardLayout } from '@/components/DashboardLayout'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  BarChart3Icon,
  TrendingUpIcon,
  EyeIcon,
  MousePointerClickIcon,
  ActivityIcon,
  UsersIcon
} from 'lucide-react'


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
      
      toast.success('Analytics updated', {
        description: 'Latest analytics data has been loaded',
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      toast.error('Failed to load analytics', {
        description: 'Unable to fetch the latest analytics data',
        action: {
          label: 'Retry',
          onClick: () => fetchAnalytics(),
        },
      });
    }
  }

  const variantAPercentage = summary ? 
    (summary.variantA / (summary.variantA + summary.variantB) * 100) || 0 : 0

  const variantBPercentage = summary ? 
    (summary.variantB / (summary.variantA + summary.variantB) * 100) || 0 : 0

  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">
              Track your A/B test performance and user engagement metrics.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                fetchAnalytics();
                toast.info('Refreshing analytics data...', {
                  description: 'Fetching the latest metrics and A/B test results',
                });
              }}
            >
              Refresh Data
            </Button>
            <Button
              onClick={() => {
                toast.success('Export started', {
                  description: 'Analytics data is being prepared for export',
                  action: {
                    label: 'Download CSV',
                    onClick: () => {
                      // Simulate CSV download
                      const csvData = 'Event,Variant,Count\nPage View,A,1250\nPage View,B,1180\nCTA Click,A,23\nCTA Click,B,31';
                      const blob = new Blob([csvData], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'analytics-data.csv';
                      a.click();
                      toast.success('Download complete!');
                    },
                  },
                });
              }}
            >
              Export Data
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
              <ActivityIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalEvents || localEvents.length}</div>
              <p className="text-xs text-muted-foreground">
                All tracked interactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <EyeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.pageViews || localEvents.filter(e => e.event === 'page_view').length}</div>
              <p className="text-xs text-muted-foreground">
                Unique page visits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CTA Clicks</CardTitle>
              <MousePointerClickIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.ctaClicks || localEvents.filter(e => e.event === 'cta_click').length}</div>
              <p className="text-xs text-muted-foreground">
                Call-to-action interactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
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
              <p className="text-xs text-muted-foreground">
                Click-through rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* A/B Test Results */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => {
              toast.info('Variant A Details', {
                description: `"Eco-Friendly Water Bottle For a Greener Tomorrow" - ${variantAPercentage.toFixed(1)}% conversion rate`,
                action: {
                  label: 'Test Variant A',
                  onClick: () => {
                    window.open('/?variant=A', '_blank');
                    toast.success('Opened Variant A in new tab');
                  },
                },
              });
            }}
          >
            <CardHeader>
              <CardTitle>Variant A Performance</CardTitle>
              <CardDescription>
                "Eco-Friendly Water Bottle For a Greener Tomorrow"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Views</span>
                <span className="text-2xl font-bold">{summary?.variantA || localEvents.filter(e => e.properties?.variant === 'A').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Traffic Share</span>
                <Badge variant="outline">{variantAPercentage.toFixed(1)}%</Badge>
              </div>
              <Progress value={variantAPercentage} className="h-2" />
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-md"
            onClick={() => {
              toast.info('Variant B Details', {
                description: `"Hydrate Better. Save the Planet." - ${variantBPercentage.toFixed(1)}% conversion rate`,
                action: {
                  label: 'Test Variant B',
                  onClick: () => {
                    window.open('/?variant=B', '_blank');
                    toast.success('Opened Variant B in new tab');
                  },
                },
              });
            }}
          >
            <CardHeader>
              <CardTitle>Variant B Performance</CardTitle>
              <CardDescription>
                "Hydrate Better. Save the Planet."
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Views</span>
                <span className="text-2xl font-bold">{summary?.variantB || localEvents.filter(e => e.properties?.variant === 'B').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Traffic Share</span>
                <Badge variant="default">{variantBPercentage.toFixed(1)}%</Badge>
              </div>
              <Progress value={variantBPercentage} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Recent Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>
              Latest user interactions and A/B test assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead>Properties</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(summary?.recentEvents || localEvents.slice(-10).reverse()).map((event, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{event.event}</TableCell>
                    <TableCell>
                      {event.properties?.variant ? (
                        <Badge variant={event.properties.variant === 'A' ? 'outline' : 'default'}>
                          {event.properties.variant}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {event.properties?.page || event.properties?.button || '-'}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
