"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, TrendingUp, DollarSign, ArrowRight } from "lucide-react"
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
    traditionalCost: 9500,
    xarvisCost: 3000,
    savingsPercentage: 67,
    traditionalRoas: 2.1,
    xarvisRoas: 2.6,
    traditionalHours: 60,
    xarvisHours: 15,
  },
  {
    value: "100K",
    label: "$100K",
    traditionalCost: 12500,
    xarvisCost: 4000,
    savingsPercentage: 68,
    traditionalRoas: 2.2,
    xarvisRoas: 2.7,
    traditionalHours: 80,
    xarvisHours: 20,
  },
  {
    value: "200K",
    label: "$200K",
    traditionalCost: 15000,
    xarvisCost: 5000,
    savingsPercentage: 67,
    traditionalRoas: 2.3,
    xarvisRoas: 2.9,
    traditionalHours: 100,
    xarvisHours: 25,
  },
  {
    value: "500K",
    label: "$500K",
    traditionalCost: 21000,
    xarvisCost: 7500,
    savingsPercentage: 70,
    traditionalRoas: 2.4,
    xarvisRoas: 3.0,
    traditionalHours: 120,
    xarvisHours: 30,
  },
];

export function CostComparisonSection() {
  const [isVisible, setIsVisible] = useState(false)
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
  const savings = tierData.traditionalCost - tierData.xarvisCost;
  const roasImprovement = Math.round((tierData.xarvisRoas - tierData.traditionalRoas) / tierData.traditionalRoas * 100);
  const timeSavings = Math.round((tierData.traditionalHours - tierData.xarvisHours) / tierData.traditionalHours * 100);

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
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/10 rounded-xl blur opacity-30"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-8 md:p-12 shadow-xl">
              <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                The most intelligent media buyer at a{" "}
                <span className="text-[#ff6363]">
                  fraction of the cost
                </span>
              </h2>
              
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
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Traditional vs XARVIS */}
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold mb-4 text-center">Traditional Approach</h3>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400">Monthly Cost</span>
                        <span className="text-2xl font-bold">${tierData.traditionalCost.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400">ROAS</span>
                        <span className="text-2xl font-bold">{tierData.traditionalRoas.toFixed(1)}x</span>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400">Weekly Hours</span>
                        <span className="text-2xl font-bold">{tierData.traditionalHours}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Team Size</span>
                        <span className="text-2xl font-bold">3-5 people</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-500 to-gray-700 rounded-xl blur opacity-30"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full">
                    <h3 className="text-2xl font-bold mb-4 text-center">XARVIS Approach</h3>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400">Monthly Cost</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-[#ff6363]">${tierData.xarvisCost.toLocaleString()}</span>
                          <span className="ml-2 text-sm bg-[#ff6363]/20 text-[#ff6363] px-2 py-1 rounded-full">-{tierData.savingsPercentage}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400">ROAS</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-[#ff6363]">{tierData.xarvisRoas.toFixed(1)}x</span>
                          <span className="ml-2 text-sm bg-[#ff6363]/20 text-[#ff6363] px-2 py-1 rounded-full">+{roasImprovement}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center border-b border-white/10 pb-4">
                        <span className="text-gray-400">Weekly Hours</span>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold text-[#ff6363]">{tierData.xarvisHours}</span>
                          <span className="ml-2 text-sm bg-[#ff6363]/20 text-[#ff6363] px-2 py-1 rounded-full">-{timeSavings}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Team Size</span>
                        <span className="text-2xl font-bold">XARVIS + 1 person</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Savings Callout */}
              <div className="mt-12 max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-50"></div>
                  <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
                    <h3 className="text-3xl font-bold mb-2">Save ${savings.toLocaleString()} Every Month</h3>
                    <p className="text-xl mb-6">Get better results with less time and resources</p>
                    <Button className="bg-gradient-to-r from-[#ff6363] to-[#ff3939] text-white font-bold py-3 px-8 rounded-full hover:opacity-90 transition-opacity">
                      Get Exclusive Early Access
                    </Button>
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