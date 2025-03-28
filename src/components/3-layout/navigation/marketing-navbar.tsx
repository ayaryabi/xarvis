"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/0-ui/button/index"
import { Container } from "@/components/0-ui/container/container"
import { Logo } from "@/components/1-common/logo"
import { Menu, X } from "lucide-react"

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center py-6">
      <Container
        className={`flex items-center justify-between rounded-xl px-8 py-4 ${
          scrolled ? "bg-black/40 backdrop-blur-xl border border-white/10" : "bg-black/20 backdrop-blur-md"
        }`}
      >
        <div className="flex items-center">
          <Logo className="mr-3" effect="holographic" />
          <span className="font-bold text-xl">XAVRIS</span>
        </div>

        <nav className="hidden md:flex items-center space-x-10">
          <NavLink href="#agent-orion">Agent Orion</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#community">Community</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Button variant="ghost">
            Log in
          </Button>
          <Button variant="white" className="rounded-lg">
            Hire XARVIS
          </Button>
        </div>
        
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-black/70 border border-white/10 flex items-center justify-center"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
      </Container>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 md:hidden flex flex-col items-center justify-center">
          <button 
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/70 border border-white/10 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5 text-white" />
          </button>
          
          <div className="w-full flex flex-col items-center space-y-8 p-8">
            <MobileNavLink href="#agent-orion" onClick={() => setMobileMenuOpen(false)}>Agent Orion</MobileNavLink>
            <MobileNavLink href="#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
            <MobileNavLink href="#community" onClick={() => setMobileMenuOpen(false)}>Community</MobileNavLink>
            <MobileNavLink href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
            
            <Button variant="white" size="xl" className="mt-4 w-full">
              Hire XARVIS
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      {children}
    </a>
  )
}

function MobileNavLink({ href, onClick, children }: { 
  href: string, 
  onClick?: () => void,
  children: React.ReactNode 
}) {
  return (
    <a 
      href={href} 
      className="text-xl text-white hover:text-[#ff6363] py-2 transition-colors w-full text-center"
      onClick={onClick}
    >
      {children}
    </a>
  )
} 