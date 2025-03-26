"use client"

import { useEffect, useRef, useState } from "react"
import { Container } from "@/components/ui/container/container"
import { Card } from "@/components/ui/card"
import { Clock, TrendingUp, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import React from "react"

interface MetricCardProps {
  title: string
  description: string
  icon: React.ReactNode
  index: number
  className?: string
}

interface ClassNameProps {
  className?: string;
}

function MetricCard({ title, description, icon, index, className }: MetricCardProps) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      {
        threshold: 0.3,
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div 
      ref={ref}
      className={cn(
        "transform transition-all duration-700 ease-out",
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        className
      )}
      style={{
        transitionDelay: `${index * 200}ms`,
      }}
    >
      <div className="relative mb-8">
        <Card 
          className="relative bg-[rgba(40,0,0,0.8)] p-8" 
          glowOnHover={true}
          permanentGlow={true}
          glowColor="from-[#ff6363]/40 to-[#ff3939]/40"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-4xl font-bold mb-2">{title}</h3>
              <p className="text-gray-400 text-lg">{description}</p>
            </div>
            <div className="h-16 w-16 rounded-full bg-[rgba(80,0,0,0.4)] border border-[#ff6363]/50 flex items-center justify-center text-[#ff6363]">
              {React.isValidElement<ClassNameProps>(icon) && 
                React.cloneElement(icon, { 
                  className: "h-8 w-8" 
                })
              }
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export function MetricsSection() {
  return (
    <section className="py-24 relative">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black to-black/90"></div>
      
      <Container className="max-w-4xl">
        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Real results. Real impact.
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what XARVIS can do for your business.
          </p>
        </div>
        
        <div className="space-y-6 relative z-10">
          <MetricCard
            title="45 hours"
            description="XARVIS saves you 45 hours of manual work per week"
            icon={<Clock className="h-6 w-6" />}
            index={0}
          />
          
          <MetricCard
            title="25% increase"
            description="XARVIS increases your campaign performance by 25 percent"
            icon={<TrendingUp className="h-6 w-6" />}
            index={1}
          />
          
          <MetricCard
            title="$10 million"
            description="XARVIS helps you manage up to $10 million in ad budget efficiently"
            icon={<DollarSign className="h-6 w-6" />}
            index={2}
          />
        </div>
      </Container>
    </section>
  )
} 