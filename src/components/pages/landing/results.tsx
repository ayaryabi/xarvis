"use client"

import { useState, useRef, useEffect } from "react"
import { Container } from "@/components/ui/container/container"
import { Heading } from "@/components/ui/heading"
import { ResultsCard } from "@/components/features/landing/results-card"
import { FeatureCard } from "@/components/features/landing/feature-card"
import { Eye, Zap, Activity } from "lucide-react"

export function ResultsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <section className="py-24" ref={containerRef} id="agent-orion">
      <Container>
        <div className="text-center mb-16">
          <Heading size="lg" gradient className="mb-6">
            Real results. Real impact.
          </Heading>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what XARVIS can do for your business.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <ResultsCard animateIn={isVisible} />

          <div className="space-y-4">
            <FeatureCard 
              number={1} 
              title="Continuous Monitoring" 
              description="Orion scans your campaigns every 15 minutes, analyzing performance against KPIs to identify trends and anomalies."
              icon={<Eye className="h-5 w-5" />}
            />
            <FeatureCard 
              number={2} 
              title="One-Click Optimizations" 
              description="Review and apply recommended budget adjustments, creative rotations, and bid strategy changes with a single click."
              icon={<Zap className="h-5 w-5" />}
            />
            <FeatureCard 
              number={3} 
              title="Intelligent Reporting" 
              description="Get curated daily, weekly and monthly reports that highlight key insights and actionable recommendations."
              icon={<Activity className="h-5 w-5" />}
            />
          </div>
        </div>
      </Container>
    </section>
  )
} 