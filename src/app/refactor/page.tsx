"use client"

import { Navbar } from "@/components/pages/landing/navbar"
import { HeroSection } from "@/components/pages/landing/hero"
import { ResultsSection } from "@/components/pages/landing/results"
import { MetricsSection } from "@/components/pages/landing/metrics"

export default function RefactorPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ResultsSection />
      <MetricsSection />
    </main>
  )
}