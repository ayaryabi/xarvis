"use client"

import { HeroSection } from "@/features/marketing/components/hero"
import { MetricsSection } from "@/features/marketing/components/metrics"
import { ResultsSection } from "@/features/marketing/components/results"
import { CostComparisonSection } from "@/features/marketing/components/cost-comparison"
import { ComingSoonSection } from "@/features/marketing/components/coming-soon"
import { PricingTable } from "@/features/subscription/components/PricingTable"

export function HomeContent() {
  return (
    <>
      <HeroSection />
      <MetricsSection />
      <ResultsSection />
      <PricingTable />
      <CostComparisonSection />
      <ComingSoonSection />
    </>
  )
} 