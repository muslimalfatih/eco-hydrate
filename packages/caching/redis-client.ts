import { Redis } from '@upstash/redis'

class RedisService {
  private static instance: RedisService
  private redis: Redis | null = null
  private isAvailable = true
  private lastError: Error | null = null

  private constructor() {
    this.initializeRedis()
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  private initializeRedis(): void {
    try {
      if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        this.redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        })
        this.isAvailable = true
        this.lastError = null
      } else {
        console.warn('Redis credentials not found, caching disabled')
        this.isAvailable = false
      }
    } catch (error) {
      this.handleConnectionError(error as Error)
    }
  }

  private handleConnectionError(error: Error): void {
    console.error('Redis connection error:', error)
    this.isAvailable = false
    this.lastError = error
  }

  public async get<T>(key: string): Promise<T | null> {
    if (!this.isAvailable || !this.redis) {
      return null
    }

    try {
      const result = await this.redis.get<T>(key)
      return result
    } catch (error) {
      this.handleConnectionError(error as Error)
      return null
    }
  }

  public async set(
    key: string,
    value: unknown,
    options?: { ex?: number }
  ): Promise<boolean> {
    if (!this.isAvailable || !this.redis) {
      return false
    }

    try {
      if (options?.ex) {
        await this.redis.set(key, value, { ex: options.ex })
      } else {
        await this.redis.set(key, value, { ex: 60 })
      }
      return true
    } catch (error) {
      this.handleConnectionError(error as Error)
      return false
    }
  }

  public async del(key: string): Promise<boolean> {
    if (!this.isAvailable || !this.redis) {
      return false
    }

    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      this.handleConnectionError(error as Error)
      return false
    }
  }

  public getStatus(): { isAvailable: boolean; lastError: Error | null } {
    return {
      isAvailable: this.isAvailable,
      lastError: this.lastError,
    }
  }
}

export const redisService = RedisService.getInstance()
