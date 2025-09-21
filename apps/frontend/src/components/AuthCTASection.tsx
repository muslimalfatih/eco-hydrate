'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/AuthContext'

export function AuthCTASection() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="bg-green-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-green-500 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-green-500 rounded w-96 mx-auto mb-8"></div>
            <div className="h-12 bg-green-500 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    // Untuk user yang sudah login
    return (
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome back, {user.email?.split('@')[0]}!
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Your sustainable lifestyle continues here – explore what's new in eco-innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3"
                >
                  My Dashboard
                </Button>
              </Link>
              <Link href="/products">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3"
                >
                  Checkout Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }


  return (
    <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your <span className="text-green-200">Sustainable Journey</span> Today
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of eco-conscious individuals and discover premium sustainable products that make a difference
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 font-semibold cursor-pointer"
              >
                Sign Up Now
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 font-semibold cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
          </div>
          
          {/* Benefits */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: "🌱", title: "Planet-Positive Products", desc: "Crafted from premium recycled materials" },
              { icon: "🚚", title: "Free Shipping", desc: "On orders over $50 - delivered to your door" },
              { icon: "💚", title: "Loyalty Rewards ", desc: "Earn points with every eco-friendly purchase" }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-3xl mb-2">{benefit.icon}</div>
                <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                <p className="text-green-100 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
