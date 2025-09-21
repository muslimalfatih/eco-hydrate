'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useABTest } from '@/hooks/useABTest' // Your updated hook
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const { variant, headline, trackEvent, switchVariant } = useABTest()
  const heroRef = useRef(null)
  const isInView = useInView(heroRef, { once: true })
  
  // Your existing parallax setup...
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150])

  // Track when hero comes into view
  useEffect(() => {
    if (isInView) {
      // 🔥 This will now track in BOTH your analytics AND Prometheus
      trackEvent('page_view', {
        page: 'home',
        component: 'hero',
        is_in_view: true
      })
    }
  }, [isInView, trackEvent])

  const handleCTAClick = () => {
    // 🔥 This will track in BOTH systems
    trackEvent('cta_click', {
      button: 'get_eco_bottle',
      location: 'hero_primary',
      headline: headline
    })

    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLearnMoreClick = () => {
    // 🔥 This will track in BOTH systems  
    trackEvent('secondary_cta_click', {
      button: 'learn_more',
      location: 'hero_secondary'
    })
  }

  return (
    <section ref={heroRef} className="hero relative min-h-screen flex items-center justify-center">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50"
        style={{ y: backgroundY }}
      />

      <motion.div className="text-center max-w-5xl px-4 z-10">
        <motion.h1 
          key={variant}
          className="text-6xl md:text-8xl font-bold text-gray-900 mb-8"
        >
          {headline}
        </motion.h1>

        <motion.div className="flex gap-6 justify-center">
          <Button onClick={handleCTAClick} size="lg">
            🌱 Get Your Eco Bottle
          </Button>
          
          <Button variant="outline" onClick={handleLearnMoreClick} size="lg">
            Learn More
          </Button>
        </motion.div>

        {/* A/B Test Demo Controls with Prometheus Info */}
        <motion.div className="mt-12 p-6 bg-white/90 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">🧪 A/B Testing + Monitoring Demo</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Current Variant:</strong> <span className="font-mono bg-blue-100 px-2 py-1 rounded">{variant}</span></p>
              <p><strong>Headline:</strong> <span className="italic">"{headline}"</span></p>
            </div>
            <div>
              <p><strong>Tracking Systems:</strong></p>
              <ul className="text-xs text-left">
                <li>✅ Local Analytics</li>
                <li>✅ Prometheus Metrics</li>
                <li>📊 Real-time Dashboard</li>
              </ul>
            </div>
          </div>
          
          <div className="flex gap-2 justify-center mt-4">
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
          
          <div className="text-xs text-gray-600 bg-green-50 p-2 rounded mt-4">
            💡 <strong>Monitoring:</strong> Visit <code>http://localhost:3000/api/metrics</code> to see Prometheus data
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
