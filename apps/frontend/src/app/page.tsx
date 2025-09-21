import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeatureSection'
import { ContactSection } from '@/components/ContactSection'

export default async function HomePage() {

  return (
    <main>
      <HeroSection />
      <FeaturesSection/>
      <ContactSection/>
    </main>
  )
}
