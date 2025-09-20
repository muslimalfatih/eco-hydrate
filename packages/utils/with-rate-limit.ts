import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { getIdentifier } from './rate-limiter'

export async function withRateLimit(
  request: NextRequest,
  rateLimiter: Ratelimit
): Promise<{ success: boolean; response?: NextResponse; headers?: Record<string, string> }> {
  const identifier = getIdentifier(request)
  
  try {
    const result = await rateLimiter.limit(identifier)
    
    const headers = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': result.reset.toString(),
    }

    if (!result.success) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: `Terlalu banyak permintaan. Coba lagi dalam ${Math.ceil((result.reset - Date.now()) / 1000)} detik.`,
            limit: result.limit,
            remaining: result.remaining,
            reset: new Date(result.reset).toISOString(),
          },
          { 
            status: 429,
            headers
          }
        )
      }
    }
    
    return { success: true, headers }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open - allow request if rate limiting fails
    return { success: true }
  }
}
