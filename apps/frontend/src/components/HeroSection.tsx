'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useABTest } from '@/hooks/useABTest' // Use the simpler version
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const { variant, headline, trackEvent, switchVariant } = useABTest()
  const heroRef = useRef(null)
  const isInView = useInView(heroRef, { once: true })
  
  // Parallax effects
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // Track page view when component is in view
  useEffect(() => {
    if (isInView) {
      trackEvent('page_view', {
        page: 'home',
        component: 'hero'
      })
    }
  }, [isInView, trackEvent])

  const handleCTAClick = () => {
    trackEvent('cta_click', {
      button: 'get_eco_bottle',
      location: 'hero_primary'
    })

    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      ref={heroRef}
      className="hero relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"
        style={{ y: backgroundY }}
      />

      {/* Main Content */}
      <motion.div 
        className="text-center max-w-5xl px-4 z-10"
        style={{ opacity: backgroundOpacity }}
        initial={{ opacity: 0, y: 100 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* 🔥 HEADLINE SHOWS IMMEDIATELY - No loading state needed */}
        <motion.h1 
          key={variant}
          className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ 
            duration: 1.2,
            delay: 0.4,
            type: "spring",
            stiffness: 100
          }}
        >
          {headline}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          Join the sustainable revolution with our premium eco-friendly water bottle.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <Button 
            onClick={handleCTAClick} 
            size="lg" 
            className="text-lg px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            🌱 Get Your Eco Bottle
          </Button>
        </motion.div>

        {/* A/B Test Demo Controls */}
        <motion.div 
          className="mt-12 p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <h3 className="text-lg font-semibold mb-4">🧪 A/B Testing Demo</h3>
          <div className="space-y-4">
            <p><strong>Current:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">Variant {variant}</span></p>
            <p className="text-sm italic">"{headline}"</p>
            
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant={variant === 'A' ? 'default' : 'outline'}
                onClick={() => switchVariant('A')}
              >
                Variant A
              </Button>
              <Button
                size="sm"
                variant={variant === 'B' ? 'default' : 'outline'}
                onClick={() => switchVariant('B')}
              >
                Variant B
              </Button>
            </div>
            
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              💡 Try adding <code>?variant=A</code> or <code>?variant=B</code> to URL
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
