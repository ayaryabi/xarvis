"use client"

import { Navbar } from "@/components/pages/marketing/navbar"
import { HeroSection } from "@/components/pages/marketing/hero"
import { MetricsSection } from "@/components/pages/marketing/metrics"
import { ResultsSection } from "@/components/pages/marketing/results"
import { CostComparisonSection } from "@/components/pages/marketing/cost-comparison"
import { ComingSoonSection } from "@/components/pages/marketing/coming-soon"
import { Footer } from "@/components/pages/marketing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MetricsSection />
      <ResultsSection />
      <CostComparisonSection />
      <ComingSoonSection />
      <Footer />
    </main>
  )
} 