import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Redis client for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Create different rate limiters for different operations
export const productReadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute for reads
  analytics: true,
  prefix: 'eco-hydrate:rl:read',
})

export const productWriteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 writes per minute
  analytics: true,
  prefix: 'eco-hydrate:rl:write',
})

export const generalApiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(50, '1 m'), // 50 requests per minute general
  analytics: true,
  prefix: 'eco-hydrate:rl:general',
})

export const contactFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 contact form submissions per minute
  analytics: true,
  prefix: 'eco-hydrate:rl:contact',
})

// IP-based identifier function
export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  let ip = 'unknown'
  
  if (forwarded) {
    ip = forwarded.split(',')[0].trim()
  } else if (realIP) {
    ip = realIP
  }
  
  // Create a more unique identifier by combining IP and user agent hash
  const identifier = `${ip}:${userAgent.slice(0, 50)}`
  return identifier
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}
