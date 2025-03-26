"use client"

import { HomeContent } from "@/components/pages/marketing/home-content"
import { MarketingNavbar } from "@/components/layout/navigation/marketing-navbar"
import { MarketingFooter } from "@/components/layout/footer/marketing-footer"

export default function RootPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <MarketingNavbar />
      <HomeContent />
      <MarketingFooter />
    </main>
  )
}
