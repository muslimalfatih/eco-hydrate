'use client'

import { motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  stock: number
}

export function ProductShowcaseSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const sectionRef = useRef(null)

  useEffect(() => {
    async function fetchShowcaseProducts() {
      try {
        const response = await fetch('/api/products?limit=6')
        const data = await response.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShowcaseProducts()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-lg animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Premium <span className="text-green-600">Eco-Friendly</span> Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of stylish, sustainable water bottles crafted for the conscious consumer
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants as any}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock < 10 && (
                  <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Stok Terbatas
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Stok: {product.stock}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link href="/products">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            >
              See All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
