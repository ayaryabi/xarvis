"use client"

import { ReactNode } from "react"
import { MarketingNavbar } from "@/components/3-layout/navigation/marketing-navbar"
import { MarketingFooter } from "@/components/3-layout/footer/marketing-footer"

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </main>
  )
} 