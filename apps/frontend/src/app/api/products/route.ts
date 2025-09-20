import { NextRequest, NextResponse } from 'next/server'
import { eq, asc, desc } from 'drizzle-orm'
import { Cache } from '@eco-hydrate/caching'
import { productReadLimiter, productWriteLimiter } from '@eco-hydrate/utils'
import { withRateLimit } from '@eco-hydrate/utils'
import { db } from '@eco-hydrate/db'
import { products } from '@eco-hydrate/db/src/schema/product'
import { CACHE_KEYS, CACHE_TTL } from '@eco-hydrate/db/src/cache-keys'

// GET /api/products - List products with caching
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitCheck = await withRateLimit(request, productReadLimiter)
  if (!rateLimitCheck.success) {
    return rateLimitCheck.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Create cache key based on all query parameters
    const cacheKey = CACHE_KEYS.PRODUCTS.LIST(page, limit, category ?? undefined)
    const fullCacheKey = `${cacheKey}:sort:${sortBy}:${sortOrder}`

    // Try to get from cache first
    const result = await Cache.withCache(
      fullCacheKey,
      async () => {
        // Build the query using dynamic mode
        const skip = (page - 1) * limit
        
        // Start with dynamic query
        let query = db
          .select({
            id: products.id,
            name: products.name,
            description: products.description,
            price: products.price,
            imageUrl: products.imageUrl,
            stock: products.stock,
            createdAt: products.createdAt,
          })
          .from(products)
          .$dynamic() 

        // Add sorting
        if (sortBy === 'price') {
          query = query.orderBy(sortOrder === 'asc' ? asc(products.price) : desc(products.price))
        } else if (sortBy === 'name') {
          query = query.orderBy(sortOrder === 'asc' ? asc(products.name) : desc(products.name))
        } else {
          query = query.orderBy(sortOrder === 'asc' ? asc(products.createdAt) : desc(products.createdAt))
        }

        // Add pagination - this now works because of $dynamic()
        query = query.limit(limit).offset(skip)

        const results = await query

        // Ambil total count secara terpisah
        const countCacheKey = CACHE_KEYS.PRODUCTS.COUNT(category ?? undefined)
        const totalCount = await Cache.withCache(
          countCacheKey,
          async () => {
            const count = await db.select().from(products)
            return count.length
          },
          { ttl: CACHE_TTL.MEDIUM }
        )

        return {
          products: results,
          pagination: {
            page,
            limit,
            total: totalCount.data,
            totalPages: Math.ceil(totalCount.data / limit),
            hasNext: page * limit < totalCount.data,
            hasPrev: page > 1
          },
          filters: {
            category,
            sortBy,
            sortOrder
          }
        }
      },
      { ttl: CACHE_TTL.SHORT }
    )

    // Create response headers
    const headers: Record<string, string> = {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'X-Cache': result.cached ? 'HIT' : 'MISS',
      ...rateLimitCheck.headers,
    }

    return NextResponse.json(result.data, { headers })

  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const rateLimitCheck = await withRateLimit(request, productWriteLimiter)
  if (!rateLimitCheck.success) {
    return rateLimitCheck.response
  }

  try {
    const body = await request.json()
    
    if (!body.name || !body.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      )
    }

    const newProduct = await db.insert(products).values({
      name: body.name,
      description: body.description || undefined,
      price: parseFloat(body.price),
      imageUrl: body.imageUrl || undefined,
      stock: body.stock ? parseInt(body.stock) : 0,
    }).returning()

    await Promise.all([
      Cache.invalidatePattern('products:list:*'),
      Cache.invalidatePattern('products:count:*'),
    ])

    const headers: Record<string, string> = {
      ...rateLimitCheck.headers,
    }

    return NextResponse.json(newProduct[0], { 
      status: 201,
      headers 
    })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
