"use client"

import { HeroSection } from "@/components/pages/marketing/hero"
import { MetricsSection } from "@/components/pages/marketing/metrics"
import { ResultsSection } from "@/components/pages/marketing/results"
import { CostComparisonSection } from "@/components/pages/marketing/cost-comparison"
import { ComingSoonSection } from "@/components/pages/marketing/coming-soon"

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