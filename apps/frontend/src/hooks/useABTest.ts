'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { analytics } from '@/lib/analytics'

import { abTestConversions, activeUsers } from '@/lib/metrics'

interface ABTestConfig {
  variants: ('A' | 'B')[]
  defaultVariant: 'A' | 'B'
  distribution: number
}

const AB_TEST_CONFIG: ABTestConfig = {
  variants: ['A', 'B'],
  defaultVariant: 'A',
  distribution: 0.5
}

const HEADLINES = {
  A: "Eco-Friendly Water Bottle For a Greener Tomorrow",
  B: "Hydrate Better. Save the Planet."
} as const

export function useABTest() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [variant, setVariant] = useState<'A' | 'B'>('A')
  const [headline, setHeadline] = useState<string>(HEADLINES.A)
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    let selectedVariant: 'A' | 'B' = 'A'
    let source = 'default'

    const urlVariant = searchParams.get('variant')
    if (urlVariant === 'A' || urlVariant === 'B') {
      selectedVariant = urlVariant
      source = 'url_parameter'
      localStorage.setItem('ab-test-variant', urlVariant)
    } else {
      const storedVariant = localStorage.getItem('ab-test-variant')
      if (storedVariant === 'A' || storedVariant === 'B') {
        selectedVariant = storedVariant
        source = 'localStorage'
      } else {
        selectedVariant = Math.random() < AB_TEST_CONFIG.distribution ? 'A' : 'B'
        source = 'random_assignment'
        localStorage.setItem('ab-test-variant', selectedVariant)
      }
    }

    // Update state
    setVariant(selectedVariant)
    setHeadline(HEADLINES[selectedVariant])

    
    analytics.track('ab_test_assigned', {
      variant: selectedVariant,
      source,
      headline: HEADLINES[selectedVariant]
    })

    try {
      // Track A/B test assignment in Prometheus
      abTestConversions.inc({
        variant: selectedVariant,
        event_type: 'assignment',
        page: 'home'
      })

      // Increment active users counter
      activeUsers.inc({ variant: selectedVariant })

      console.log(`📊 Prometheus: Tracked assignment - Variant ${selectedVariant} from ${source}`)
    } catch (error) {
      // Graceful failure - don't break the app if metrics fail
      console.warn('Prometheus metrics failed:', error)
    }

    return () => {
      try {
        activeUsers.dec({ variant: selectedVariant })
        console.log(`📊 Prometheus: Decremented active users for variant ${selectedVariant}`)
      } catch (error) {
        console.warn('Prometheus cleanup failed:', error)
      }
    }

  }, [isClient, searchParams])

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    analytics.track(eventName, {
      ...properties,
      variant,
      headline,
      ab_test_active: true
    })

    try {
      // Track CTA clicks in Prometheus
      if (eventName === 'cta_click') {
        abTestConversions.inc({
          variant,
          event_type: 'cta_click',
          page: 'home'
        })
        console.log(`📊 Prometheus: Tracked CTA click - Variant ${variant}`)
      }

      // Track form submissions
      if (eventName === 'contact_form_submitted' || eventName === 'order_submitted') {
        abTestConversions.inc({
          variant,
          event_type: 'conversion',
          page: 'home'
        })
        console.log(`📊 Prometheus: Tracked conversion - ${eventName} for Variant ${variant}`)
      }

      // Track page views
      if (eventName === 'page_view') {
        abTestConversions.inc({
          variant,
          event_type: 'page_view',
          page: properties.page || 'home'
        })
      }

      // Track secondary CTA clicks
      if (eventName === 'secondary_cta_click') {
        abTestConversions.inc({
          variant,
          event_type: 'secondary_cta',
          page: 'home'
        })
        console.log(`📊 Prometheus: Tracked secondary CTA - Variant ${variant}`)
      }

    } catch (error) {
      // Graceful failure - metrics shouldn't break user experience
      console.warn('Prometheus event tracking failed:', error)
    }
  }

  const switchVariant = (newVariant: 'A' | 'B') => {
    
    const previousVariant = variant

    setVariant(newVariant)
    setHeadline(HEADLINES[newVariant])
    localStorage.setItem('ab-test-variant', newVariant)
    
    const params = new URLSearchParams(searchParams.toString())
    params.set('variant', newVariant)
    router.replace(`?${params.toString()}`, { scroll: false })
    
  
    trackEvent('variant_switched', {
      from_variant: variant,
      to_variant: newVariant,
      source: 'manual_switch'
    })

    
    try {
      
      activeUsers.dec({ variant: previousVariant })
      
      // Increment new variant active users
      activeUsers.inc({ variant: newVariant })
      
      // Track the switch event
      abTestConversions.inc({
        variant: newVariant,
        event_type: 'variant_switched',
        page: 'home'
      })

      console.log(`📊 Prometheus: Switched from ${previousVariant} to ${newVariant}`)
    } catch (error) {
      console.warn('Prometheus variant switch tracking failed:', error)
    }
  }

  return {
    variant,
    headline,
    isLoading,
    trackEvent,
    switchVariant,
    config: AB_TEST_CONFIG,
    isClient
  }
}
