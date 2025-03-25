"use client"

import { Navbar } from "@/components/pages/landing/navbar"
import { HeroSection } from "@/components/pages/landing/hero"

export default function RefactorPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
    </main>
  )
}