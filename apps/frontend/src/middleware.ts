import { NextRequest, NextResponse } from 'next/server'

let httpRequestDuration: any = null

// Lazy load metrics to avoid server-side issues
async function getMetrics() {
  if (!httpRequestDuration) {
    try {
      const metrics = await import('@/lib/metrics')
      httpRequestDuration = metrics.httpRequestDuration
    } catch (error) {
      console.warn('Metrics not available in middleware')
    }
  }
  return httpRequestDuration
}

export async function middleware(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const response = NextResponse.next()
    
    // Track timing if metrics available
    const duration = (Date.now() - startTime) / 1000
    const metricsHandler = await getMetrics()
    
    if (metricsHandler) {
      metricsHandler.observe(
        {
          method: request.method,
          route: request.nextUrl.pathname,
          status_code: response.status.toString(),
          variant: request.nextUrl.searchParams.get('variant') || 'unknown'
        },
        duration
      )
    }
    
    return response
    
  } catch (error) {
    console.error('Middleware error:', error)
    throw error
  }
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|metrics).*)',
  ]
}
