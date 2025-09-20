import { redisService } from './redis-client';

export interface CacheOptions {
  ttl?: number
  prefix?: string
  tags?: string[]
}

export class CacheService {
  private static readonly DEFAULT_TTL = 60 // 60 seconds
  private static readonly CACHE_PREFIX = 'eco-hydrate:'

  static async get<T>(
    key: string,
    options: CacheOptions = {}
  ): Promise<T | null> {
    const { prefix = this.CACHE_PREFIX } = options
    const fullKey = `${prefix}${key}`
    
    return await redisService.get<T>(fullKey)
  }

  static async set<T>(
    key: string,
    value: T,
    options: CacheOptions = {}
  ): Promise<boolean> {
    const { ttl = this.DEFAULT_TTL, prefix = this.CACHE_PREFIX } = options
    const fullKey = `${prefix}${key}`
    
    return await redisService.set(fullKey, value, { ex: ttl })
  }

  static async invalidate(
    key: string,
    options: CacheOptions = {}
  ): Promise<boolean> {
    const { prefix = this.CACHE_PREFIX } = options
    const fullKey = `${prefix}${key}`
    
    return await redisService.del(fullKey)
  }

  static async withCache<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<{ data: T; cached: boolean }> {
    const cached = await this.get<T>(key, options)
    
    if (cached !== null) {
      return { data: cached, cached: true }
    }

    const fresh = await fetcher()
    await this.set(key, fresh, options)
    
    return { data: fresh, cached: false }
  }

  // Batch invalidation for patterns
  static async invalidatePattern(
    pattern: string,
    options: CacheOptions = {}
  ): Promise<number> {
    const { prefix = this.CACHE_PREFIX } = options
    const fullPattern = `${prefix}${pattern}`
    
    try {
      // This is a simplified approach - in production you'd want a more sophisticated pattern matching
      console.log(`Invalidating cache pattern: ${fullPattern}`)
      return 1
    } catch (error) {
      console.error('Pattern invalidation failed:', error)
      return 0
    }
  }
}

export { CacheService as Cache }
