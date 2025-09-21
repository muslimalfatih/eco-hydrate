'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { analytics } from '@/lib/analytics'

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
  const [headline, setHeadline] = useState<string>(HEADLINES.A) // Change to string
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

  }, [isClient, searchParams])

  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    analytics.track(eventName, {
      ...properties,
      variant,
      headline,
      ab_test_active: true
    })
  }

  const switchVariant = (newVariant: 'A' | 'B') => {
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
