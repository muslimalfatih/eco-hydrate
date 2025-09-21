// Only initialize metrics on server-side
let register: any = null
let httpRequestDuration: any = null
let abTestConversions: any = null
let activeUsers: any = null

if (typeof window === 'undefined') {
  try {
    const promClient = require('prom-client')
    
    register = promClient.register
    
    // Auto-collect Node.js runtime metrics
    promClient.collectDefaultMetrics({
      register,
      prefix: 'eco_hydrate_',
      gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    })

    // HTTP Request Duration Histogram
    httpRequestDuration = new promClient.Histogram({
      name: 'eco_hydrate_http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'variant'],
      buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
    })

    // A/B Test Conversion Counter  
    abTestConversions = new promClient.Counter({
      name: 'eco_hydrate_ab_test_conversions_total',
      help: 'Total A/B test conversions by variant and event type',
      labelNames: ['variant', 'event_type', 'page']
    })

    // Active Users Gauge
    activeUsers = new promClient.Gauge({
      name: 'eco_hydrate_active_users',
      help: 'Number of currently active users',
      labelNames: ['variant']
    })

    console.log('✅ Prometheus metrics initialized (server-side)')
  } catch (error) {
    console.warn('Failed to initialize Prometheus metrics:', error)
  }
} else {
  // Client-side: Create mock objects to prevent errors
  const mockMetric = {
    inc: () => {},
    dec: () => {},
    observe: () => {}
  }
  
  httpRequestDuration = mockMetric
  abTestConversions = mockMetric
  activeUsers = mockMetric
  
  console.log('📊 Using mock metrics (client-side)')
}

export { register, httpRequestDuration, abTestConversions, activeUsers }
