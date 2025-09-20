export const CACHE_KEYS = {
  PRODUCTS: {
    LIST: (page: number, limit: number, category?: string) => 
      `products:list:page:${page}:limit:${limit}:category:${category || 'all'}`,
    DETAIL: (id: string) => `products:detail:${id}`,
    COUNT: (category?: string) => `products:count:category:${category || 'all'}`,
  },
  USER: {
    PROFILE: (userId: string) => `user:profile:${userId}`,
    PREFERENCES: (userId: string) => `user:preferences:${userId}`,
  },
  ANALYTICS: {
    POPULAR_PRODUCTS: 'analytics:popular:products',
    VIEW_COUNT: (productId: string) => `analytics:views:${productId}`,
  }
} as const

export const CACHE_TTL = {
  SHORT: 60,        // 1 minute
  MEDIUM: 300,      // 5 minutes
  LONG: 1800,       // 30 minutes
  VERY_LONG: 3600,  // 1 hour
} as const
