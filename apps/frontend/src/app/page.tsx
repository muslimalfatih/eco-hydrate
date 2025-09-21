import { HeroSection } from '@/components/HeroSection'
import { ProductShowcaseSection } from '@/components/ProductShowcaseSection'
import { FeaturesSection } from '@/components/FeatureSection'
import { AuthCTASection } from '@/components/AuthCTASection'
import { ContactSection } from '@/components/ContactSection'

export default async function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <ProductShowcaseSection />
      <AuthCTASection />
      <ContactSection />
    </main>
  )
}
