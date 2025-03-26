"use client"

import Link from "next/link"
import { Container } from "@/components/0-ui/container/container"
import { Logo } from "@/components/1-common/logo"
import { Linkedin, Instagram, Youtube } from "lucide-react"

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      {children}
    </a>
  )
}

function SocialIcon({ icon, href }: { icon: React.ReactNode, href: string }) {
  return (
    <a 
      href={href}
      className="w-10 h-10 rounded-full bg-black/40 border border-white/10 flex items-center justify-center transition-colors hover:bg-white/5"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  )
}

// Custom X icon (Twitter rebranded)
function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function MarketingFooter() {
  return (
    <footer className="py-8 border-t border-white/10">
      <Container>
        <div className="flex flex-col space-y-8">
          {/* Main row - Logo, navigation, and social icons */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center">
              <Logo className="mr-2" effect="holographic" />
              <span className="font-bold text-xl">XARVIS</span>
            </div>
            
            {/* Navigation */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 order-3 lg:order-2">
              <FooterLink href="#agent-orion">Agent Orion</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#community">Community</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="/privacy">Privacy</FooterLink>
              <FooterLink href="/terms">Terms</FooterLink>
              <FooterLink href="/data-deletion">Data Deletion</FooterLink>
            </div>
            
            {/* Social icons */}
            <div className="flex gap-2 order-2 lg:order-3">
              <SocialIcon 
                icon={<XIcon className="h-5 w-5 text-gray-400" />} 
                href="https://x.com/xarvis" 
              />
              <SocialIcon 
                icon={<Linkedin className="h-5 w-5 text-gray-400" />} 
                href="https://linkedin.com/company/xarvis" 
              />
              <SocialIcon 
                icon={<Instagram className="h-5 w-5 text-gray-400" />} 
                href="https://instagram.com/xarvis" 
              />
              <SocialIcon 
                icon={<Youtube className="h-5 w-5 text-gray-400" />} 
                href="https://youtube.com/xarvis" 
              />
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-sm text-gray-500 text-center">
            © 2025 XARVIS. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  )
} 