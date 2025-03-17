"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, DollarSign, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-[#ff6363]/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

export function CostComparisonSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

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
      }
    )

    const currentRef = sectionRef.current
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
    <section 
      ref={sectionRef}
      className={cn(
        "py-24 relative overflow-hidden",
        isVisible ? "opacity-100" : "opacity-0",
        "transition-opacity duration-1000"
      )}
      id="cost-comparison"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-gradient-to-l from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div 
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div 
              className={cn(
                "absolute -inset-0.5 rounded-xl blur opacity-30 transition-all duration-500",
                isHovered 
                  ? "bg-gradient-to-r from-[#ff6363] to-[#ff3939]" 
                  : "bg-gradient-to-r from-white/20 to-white/10"
              )}
            ></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-12 shadow-xl transition-all duration-300 hover:border-[#ff6363]/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  The most intelligent media buyer at a{" "}
                  <span className="text-[#ff6363]">
                    fraction of the cost
                  </span>
                </h2>
                <div 
                  className="relative"
                  onMouseEnter={() => setIsTooltipVisible(true)}
                  onMouseLeave={() => setIsTooltipVisible(false)}
                >
                  <div className="cursor-help p-1">
                    <Info className="h-5 w-5 text-gray-400" />
                  </div>
                  {isTooltipVisible && (
                    <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl z-50 text-sm text-gray-300">
                      Based on managing $200K monthly ad spend across multiple platforms
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 my-12">
                <BenefitCard
                  icon={<Clock className="h-8 w-8 text-[#ff6363]" />}
                  title="Save 45+ hours"
                  description="Automate manual tasks and focus on strategy"
                />
                
                <BenefitCard
                  icon={<TrendingUp className="h-8 w-8 text-[#ff6363]" />}
                  title="25% better results"
                  description="Improve campaign performance with AI optimization"
                />
                
                <BenefitCard
                  icon={<DollarSign className="h-8 w-8 text-[#ff6363]" />}
                  title="67% cost reduction"
                  description="Lower operational costs while improving outcomes"
                />
              </div>
              
              <div className="text-center mt-8">
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  XARVIS delivers elite media buying performance while dramatically reducing your operational costs and time investment.
                </p>
                
                <Button 
                  className={cn(
                    "text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-all duration-500",
                    isHovered 
                      ? "bg-gradient-to-r from-[#ff6363] to-[#ff3939]" 
                      : "bg-white/10 hover:bg-white/20 backdrop-blur-lg"
                  )}
                >
                  Get Started Today
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 