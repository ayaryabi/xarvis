"use client"

import React from 'react'
import { Navbar } from "@/components/pages/landing/navbar"
import { Footer } from "@/components/pages/landing/footer"

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      {children}
      <Footer />
    </main>
  )
} 