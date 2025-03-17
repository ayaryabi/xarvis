"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, DollarSign } from "lucide-react"
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

// Define the spend tiers and their corresponding costs
const spendTiers = [
  {
    value: "50K",
    label: "$50K",
    traditionalCosts: [
      { item: "Media Buyers (2)", cost: 6000 },
      { item: "Analytics Team", cost: 2000 },
      { item: "Creative Optimization", cost: 1000 },
      { item: "Reporting Tools", cost: 500 },
    ],
    xarvisCosts: [
      { item: "XARVIS Platform", cost: 2000 },
      { item: "Media Specialist (1)", cost: 1000 },
    ],
    savingsPercentage: 67,
  },
  {
    value: "100K",
    label: "$100K",
    traditionalCosts: [
      { item: "Media Buyers (2)", cost: 7500 },
      { item: "Analytics Team", cost: 3000 },
      { item: "Creative Optimization", cost: 1200 },
      { item: "Reporting Tools", cost: 800 },
    ],
    xarvisCosts: [
      { item: "XARVIS Platform", cost: 3000 },
      { item: "Media Specialist (1)", cost: 1000 },
    ],
    savingsPercentage: 68,
  },
  {
    value: "200K",
    label: "$200K",
    traditionalCosts: [
      { item: "Media Buyers (3)", cost: 9000 },
      { item: "Analytics Team", cost: 3500 },
      { item: "Creative Optimization", cost: 1500 },
      { item: "Reporting Tools", cost: 1000 },
    ],
    xarvisCosts: [
      { item: "XARVIS Platform", cost: 4000 },
      { item: "Media Specialist (1)", cost: 1000 },
    ],
    savingsPercentage: 67,
  },
  {
    value: "500K",
    label: "$500K",
    traditionalCosts: [
      { item: "Media Buyers (4)", cost: 12000 },
      { item: "Analytics Team", cost: 5000 },
      { item: "Creative Optimization", cost: 2500 },
      { item: "Reporting Tools", cost: 1500 },
    ],
    xarvisCosts: [
      { item: "XARVIS Platform", cost: 6000 },
      { item: "Media Specialist (1)", cost: 1500 },
    ],
    savingsPercentage: 70,
  },
];

export function CostComparisonSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [selectedTier, setSelectedTier] = useState("200K")
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

  // Find the selected tier data
  const tierData = spendTiers.find(tier => tier.value === selectedTier) || spendTiers[2];
  
  // Calculate totals
  const traditionalTotal = tierData.traditionalCosts.reduce((sum, item) => sum + item.cost, 0);
  const xarvisTotal = tierData.xarvisCosts.reduce((sum, item) => sum + item.cost, 0);
  const savings = traditionalTotal - xarvisTotal;

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
              </div>
              
              <div className="mb-8">
                <div className="text-center mb-4">
                  <p className="text-lg text-gray-300">Select your monthly ad spend:</p>
                </div>
                <div className="flex justify-center space-x-4">
                  {spendTiers.map((tier) => (
                    <button
                      key={tier.value}
                      onClick={() => setSelectedTier(tier.value)}
                      className={cn(
                        "px-4 py-2 rounded-lg transition-all duration-300",
                        selectedTier === tier.value
                          ? "bg-[#ff6363] text-white"
                          : "bg-white/10 text-gray-300 hover:bg-white/20"
                      )}
                    >
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 my-12">
                {/* Traditional Approach */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold mb-6 text-center">Traditional Approach</h3>
                    <div className="space-y-4">
                      {tierData.traditionalCosts.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center py-3"
                        >
                          <span>{item.item}</span>
                          <span className="text-xl">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 border-t border-white/20 mt-4 pt-4 font-bold">
                        <span>Total Monthly Cost</span>
                        <span className="text-xl">${traditionalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* XARVIS Approach */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-30"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold mb-6 text-center">XARVIS Approach</h3>
                    <div className="space-y-4">
                      {tierData.xarvisCosts.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex justify-between items-center py-3"
                        >
                          <span>{item.item}</span>
                          <span className="text-xl">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center py-3 border-t border-white/20 mt-4 pt-4 font-bold">
                        <span>Total Monthly Cost</span>
                        <span className="text-xl">${xarvisTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
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
                  title={`${tierData.savingsPercentage}% cost reduction`}
                  description="Lower operational costs while improving outcomes"
                />
              </div>
              
              {/* Savings Callout */}
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-50"></div>
                  <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
                    <h3 className="text-3xl font-bold mb-2">Save ${savings.toLocaleString()} Every Month</h3>
                    <p className="text-xl mb-4">That's a <span className="font-bold text-[#ff6363]">{tierData.savingsPercentage}% cost reduction</span> with the same or better performance</p>
                    <div className="mt-6">
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
              
              <div className="text-center mt-8">
                <p className="text-sm text-gray-400">
                  Based on managing {tierData.label} monthly ad spend across multiple platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 