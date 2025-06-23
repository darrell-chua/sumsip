import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { PricingSection } from '@/components/PricingSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { CTASection } from '@/components/CTASection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}