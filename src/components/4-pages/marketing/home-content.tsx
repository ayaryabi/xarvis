"use client"

import { HeroSection } from "@/components/4-pages/marketing/hero"
import { MetricsSection } from "@/components/4-pages/marketing/metrics"
import { ResultsSection } from "@/components/4-pages/marketing/results"
import { CostComparisonSection } from "@/components/4-pages/marketing/cost-comparison"
import { ComingSoonSection } from "@/components/4-pages/marketing/coming-soon"

export function HomeContent() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <ResultsSection />
      <CostComparisonSection />
      <ComingSoonSection />
    </>
  )
} 