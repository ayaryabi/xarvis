"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MacWindow } from "@/components/mac-window"
import { SlackInterface } from "@/components/slack-interface"
import { Button } from "@/components/ui/button"
import {
  ChevronRight,
  Download,
  ArrowRight,
  Check,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Layers,
  Brain,
  Clock,
  TrendingUp,
  DollarSign,
} from "lucide-react"
import { cn } from "@/lib/utils"

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <header className={cn("fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 py-6")}>
        <div
          className={cn(
            "flex items-center justify-between w-[90%] max-w-6xl rounded-xl px-8 py-4",
            scrolled ? "bg-black/40 backdrop-blur-xl border border-white/10" : "bg-black/20 backdrop-blur-md",
          )}
        >
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full flex items-center justify-center mr-3 overflow-hidden metallic-logo-container">
              <img src="/logo_1.png" alt="XARVIS" className="h-8 w-8 object-cover" />
            </div>
            <span className="font-bold text-xl">XARVIS</span>
          </div>

          <nav className="hidden md:flex items-center space-x-10">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#results">Results</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#roadmap">Roadmap</NavLink>
            <NavLink href="#community">Community</NavLink>
            <NavLink href="#docs">Docs</NavLink>
          </nav>

          <div className="flex items-center gap-6">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              Log in
            </Button>
            <Button className="bg-white text-black hover:bg-white/90 transition-all px-5 py-2 rounded-lg">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#ff6363]/30 to-transparent rounded-full blur-[120px]"></div>
            <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-[#ff6363]/30 to-transparent rounded-full blur-[120px]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover opacity-10 mix-blend-overlay"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <div className="inline-block mb-6 px-4 py-1 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-sm text-[#ff6363]">
                Introducing XARVIS for Slack
              </div>
              <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                The most intelligent media buyer
                <br />
                right in your workflow.
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Optimize your ad campaigns with AI-powered insights and recommendations without ever leaving Slack.
                Fast, intelligent, and reliable.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Button className="bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white px-8 py-6 rounded-xl text-lg h-auto shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20">
                  <Download className="mr-2 h-5 w-5" />
                  Install on Slack
                </Button>
                <Button
                  variant="outline"
                  className="border-white/10 bg-white/5 backdrop-blur-lg text-white hover:bg-white/10 px-8 py-6 rounded-xl text-lg h-auto"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="relative mx-auto max-w-5xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-2xl blur opacity-30"></div>
              <MacWindow>
                <SlackInterface />
              </MacWindow>

              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-xl text-sm text-gray-400 px-6 py-2 rounded-full border border-white/10 shadow-lg">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full overflow-hidden mr-2">
                    <img src="/logo_1.png" alt="XARVIS" className="h-4 w-4 object-cover" />
                  </div>
                  <span>v1.0.2 • Install via Slack App Directory</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative" id="features">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-gradient-to-l from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Optimize campaigns, not detours.
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                One interface, everything you need to maximize your ROAS.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="Real-time Analytics"
                description="Get instant insights on campaign performance with detailed metrics and visualizations."
                icon="📊"
              />
              <FeatureCard
                title="AI Recommendations"
                description="Receive actionable suggestions to optimize budgets, targeting, and creative assets."
                icon="🧠"
              />
              <FeatureCard
                title="Automated Adjustments"
                description="Let AI handle routine optimizations while you focus on strategy and growth."
                icon="⚙️"
              />
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" id="results">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-gradient-to-r from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Real results. Real impact.
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">See what XARVIS can do for your business.</p>
            </div>

            <div className="max-w-5xl mx-auto">
              <ResultsCard
                icon={<Clock className="h-10 w-10 text-[#ff6363]" />}
                title="45 hours"
                description="XARVIS saves you 45 hours of manual work per week"
                index={0}
              />

              <ResultsCard
                icon={<TrendingUp className="h-10 w-10 text-[#ff6363]" />}
                title="25% increase"
                description="XARVIS increases your campaign performance by 25 percent"
                index={1}
              />

              <ResultsCard
                icon={<DollarSign className="h-10 w-10 text-[#ff6363]" />}
                title="$10 million"
                description="XARVIS helps you manage up to $10 million in ad budget efficiently"
                index={2}
              />
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" id="pricing">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-gradient-to-r from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Get started with our beta offer and save 50%</p>
            </div>

            <div className="max-w-lg mx-auto">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-2xl blur opacity-30"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                  <div className="absolute -top-5 right-8 bg-[#ff6363] text-white px-4 py-1 rounded-full text-sm font-bold">
                    BETA OFFER
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Professional Plan</h3>
                    <div className="flex items-center justify-center">
                      <div className="text-gray-400 text-lg line-through mr-2">$500</div>
                      <div className="text-4xl font-bold">$250</div>
                      <div className="text-gray-400 ml-1">/month</div>
                    </div>
                    <div className="text-[#ff6363] text-sm mt-1">50% off during beta</div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <PricingFeature text="Unlimited campaigns" />
                    <PricingFeature text="AI-powered recommendations" />
                    <PricingFeature text="Real-time analytics" />
                    <PricingFeature text="Automated optimizations" />
                    <PricingFeature text="Multi-platform support" />
                    <PricingFeature text="Priority support" />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white py-6 rounded-xl text-lg h-auto shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20">
                    Get Started
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>

                  <div className="text-center text-sm text-gray-400 mt-4">No credit card required to start</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" id="roadmap">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-gradient-to-l from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Coming soon
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">Exciting new features on our roadmap</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <RoadmapCard
                title="Fully Autonomous Campaign Creation"
                description="Create high-performing campaigns with a single prompt. AI handles targeting, creative selection, and budget allocation."
                icon={<Sparkles className="h-6 w-6 text-[#ff6363]" />}
              />
              <RoadmapCard
                title="Fully Autonomous Campaign Optimization"
                description="Let AI continuously monitor and optimize your campaigns 24/7, making real-time adjustments for maximum performance."
                icon={<Zap className="h-6 w-6 text-[#ff6363]" />}
              />
              <RoadmapCard
                title="Advanced Audience Targeting"
                description="Discover untapped audience segments with AI-powered analysis of your customer data and market trends."
                icon={<Target className="h-6 w-6 text-[#ff6363]" />}
              />
              <RoadmapCard
                title="Cross-Platform Analytics"
                description="Get unified insights across all your marketing channels in one centralized dashboard with actionable recommendations."
                icon={<BarChart3 className="h-6 w-6 text-[#ff6363]" />}
              />
              <RoadmapCard
                title="Creative Asset Generation"
                description="Generate high-converting ad creatives tailored to your brand and target audience with AI-powered design tools."
                icon={<Layers className="h-6 w-6 text-[#ff6363]" />}
              />
              <RoadmapCard
                title="Predictive Budget Allocation"
                description="Optimize your marketing budget with AI predictions that identify the highest ROI opportunities across channels."
                icon={<Brain className="h-6 w-6 text-[#ff6363]" />}
              />
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden" id="community">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Stay in the loop.
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Join the community and learn how other people get the most out of XARVIS.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <CommunityCard
                icon={
                  <svg className="h-8 w-8" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M19.712 33.642c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628zm14.58 0c-1.452 0-2.628-1.176-2.628-2.628s1.176-2.628 2.628-2.628c1.44 0 2.616 1.176 2.616 2.628s-1.176 2.628-2.616 2.628zm-14.58-8.856c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628zm14.58 0c-1.452 0-2.628-1.176-2.628-2.628s1.176-2.628 2.628-2.628c1.44 0 2.616 1.176 2.616 2.628s-1.176 2.628-2.616 2.628z"
                      fill="#E01E5A"
                    />
                    <path
                      d="M34.292 43.5c-1.452 0-2.628-1.176-2.628-2.628s1.176-2.628 2.628-2.628c1.44 0 2.616 1.176 2.616 2.628s-1.176 2.628-2.616 2.628zm0-14.58c-1.452 0-2.628-1.176-2.628-2.628s1.176-2.628 2.628-2.628c1.44 0 2.616 1.176 2.616 2.628s-1.176 2.628-2.616 2.628zm-14.58 14.58c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628zm0-14.58c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628z"
                      fill="#36C5F0"
                    />
                    <path
                      d="M43.5 34.292c0-1.452-1.176-2.628-2.628-2.628s-2.628 1.176-2.628 2.628c0 1.44 1.176 2.616 2.628 2.616s2.628-1.176 2.628-2.616zm-14.58 0c0-1.452-1.176-2.628-2.628-2.628s-2.628 1.176-2.628 2.628c0 1.44 1.176 2.616 2.628 2.616s2.628-1.176 2.628-2.616zm14.58-14.58c0-1.452-1.176-2.628-2.628-2.628s-2.628 1.176-2.628 2.628c0 1.44 1.176 2.616 2.628 2.616s2.628-1.176 2.628-2.616zm-14.58 0c0-1.452-1.176-2.628-2.628-2.628s-2.628 1.176-2.628 2.628c0 1.44 1.176 2.616 2.628 2.616s2.628-1.176 2.628-2.616z"
                      fill="#2EB67D"
                    />
                    <path
                      d="M19.712 43.5c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628zm0-14.58c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628zm-8.856 14.58c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628zm0-14.58c-1.44 0-2.616-1.176-2.616-2.628s1.176-2.628 2.616-2.628c1.452 0 2.628 1.176 2.628 2.628s-1.176 2.628-2.628 2.628z"
                      fill="#ECB22E"
                    />
                  </svg>
                }
                title="Slack"
                stats="24k members"
                description="Get the inside track on new features and learn how other people use XARVIS."
                actionText="Join"
              />
              <CommunityCard
                icon={
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                      fill="white"
                    />
                  </svg>
                }
                title="X/Twitter"
                stats="61k followers"
                description="Keep up to date with the latest releases, features and improvements."
                actionText="Follow"
              />
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-2xl blur opacity-30"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        Ready to transform your media buying?
                      </h3>
                      <p className="text-gray-400 mb-6 md:mb-0">
                        Join thousands of marketers who&apos;ve increased ROAS by an average of 32%.
                      </p>
                    </div>
                    <Button className="bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white px-8 py-6 rounded-xl text-lg h-auto whitespace-nowrap shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20">
                      Get Started Free
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-white/10 relative">
        <div className="absolute inset-0 z-0">
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#ff6363]/10 to-transparent blur-[100px]"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="h-8 w-8 rounded-full flex items-center justify-center mr-2 overflow-hidden metallic-logo-container">
                <img src="/logo_1.png" alt="XARVIS" className="h-8 w-8 object-cover" />
              </div>
              <span className="font-bold text-xl">XARVIS</span>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-6 md:mb-0">
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#results">Results</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#roadmap">Roadmap</FooterLink>
              <FooterLink href="#community">Community</FooterLink>
              <FooterLink href="#blog">Blog</FooterLink>
              <FooterLink href="#docs">Docs</FooterLink>
              <FooterLink href="#privacy">Privacy</FooterLink>
              <FooterLink href="#terms">Terms</FooterLink>
            </div>

            <div className="text-sm text-gray-500">© 2025 XARVIS. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface NavLinkProps {
  href: string
  children: React.ReactNode
}

function NavLink({ href, children }: NavLinkProps) {
  return (
    <a href={href} className="text-gray-400 hover:text-white transition-colors">
      {children}
    </a>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all shadow-lg">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

interface ResultsCardProps {
  icon: React.ReactNode
  title: string
  description: string
  index: number
}

function ResultsCard({ icon, title, description, index }: ResultsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px",
      },
    )

    const currentRef = cardRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative mb-16 transform transition-all duration-1000 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20",
        index % 2 === 0 ? "text-left" : "text-right",
      )}
      style={{
        transitionDelay: `${index * 200}ms`,
      }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-30"></div>
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 shadow-xl">
        <div className={`flex items-center ${index % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <div className="w-16 h-16 rounded-full bg-[#ff6363]/10 flex items-center justify-center mb-4">{icon}</div>
        </div>

        <h3 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
          {title}
        </h3>
        <p className="text-xl text-gray-300">{description}</p>
      </div>
    </div>
  )
}

interface RoadmapCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function RoadmapCard({ title, description, icon }: RoadmapCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all shadow-lg h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-full bg-[#ff6363]/10 flex items-center justify-center">{icon}</div>
          <div className="flex items-center">
            <div className="h-2 w-2 rounded-full bg-[#ff6363] mr-2 animate-pulse"></div>
            <span className="text-xs font-medium text-white/70 tracking-wider bg-gradient-to-r from-[#ff6363] to-[#ff3939] bg-clip-text text-transparent">
              COMING SOON
            </span>
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </div>
  )
}

interface CommunityCardProps {
  icon: React.ReactNode
  title: string
  stats: string
  description: string
  actionText: string
}

function CommunityCard({ icon, title, stats, description, actionText }: CommunityCardProps) {
  return (
    <div className="relative group">
      <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all shadow-lg h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            {icon}
            <span className="text-xl font-bold ml-2">{title}</span>
          </div>
          <div className="text-gray-400">{stats}</div>
        </div>

        <p className="text-gray-300 mb-6">{description}</p>

        <a href="#" className="inline-flex items-center text-white hover:text-[#ff6363] transition-colors">
          {actionText}
          <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </div>
    </div>
  )
}

interface PricingFeatureProps {
  text: string
}

function PricingFeature({ text }: PricingFeatureProps) {
  return (
    <div className="flex items-center">
      <div className="h-5 w-5 rounded-full bg-[#ff6363]/20 flex items-center justify-center mr-3">
        <Check className="h-3 w-3 text-[#ff6363]" />
      </div>
      <span className="text-gray-300">{text}</span>
    </div>
  )
}

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