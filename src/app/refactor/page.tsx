"use client"

import { Navbar } from "@/components/pages/landing/navbar"
import { HeroSection } from "@/components/pages/landing/hero"
import { MetricsSection } from "@/components/pages/landing/metrics"
import { ResultsSection } from "@/components/pages/landing/results"
import { CostComparisonSection } from "@/components/pages/landing/cost-comparison"

export default function RefactorPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <MetricsSection />
      <ResultsSection />
      <CostComparisonSection />
    </main>
  )
}