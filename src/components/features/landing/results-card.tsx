"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Stat } from "@/components/ui/stat"
import { DollarSign, Shield, ArrowRight, ArrowUpRight, PieChart, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { Heading } from "@/components/ui/heading"
import { Badge } from "@/components/ui/badge"

interface ResultsCardProps {
  className?: string
  animateIn?: boolean
}

export function ResultsCard({ 
  className,
  animateIn = true
}: ResultsCardProps) {
  return (
    <div className={cn(
      "transform transition-all duration-1000",
      animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20",
      className
    )}>
      <div className="relative mb-8">
        {/* Custom glow effect outside the card (stronger than hover glow) */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363]/30 to-[#ff3939]/30 rounded-xl blur opacity-20"></div>
        
        <Card 
          variant="results"
          padding="lg"
          className="relative"
        >
          <Badge 
            icon={<Shield />} 
            variant="primary"
            className="mb-6"
          >
            Agent Orion
          </Badge>
        
          <div className="flex items-center mb-6">
            <div className="relative mr-5">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-black border border-white/10">
                <div className="h-full w-full subtle-glow flex items-center justify-center">
                  <img src="/agent_orion.png" alt="Agent Orion" className="h-14 w-14 object-contain" />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                Daily Campaign Management
              </h2>
            </div>
          </div>
          
          <div className="pl-4 border-l-2 border-[#ff6363]/30 mb-8">
            <p className="text-lg text-gray-300">
              24/7 campaign monitoring with AI-powered optimization recommendations for maximum ROAS.
            </p>
          </div>
          
          <div className="bg-black/20 p-6 rounded-xl mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5">
              <div className="flex items-center mb-2 sm:mb-0">
                <DollarSign className="h-5 w-5 text-[#ff6363] mr-2" />
                <span className="text-white font-medium">Impact for a $50K/month ad account</span>
              </div>
              <Badge 
                variant="primary"
                className="text-xs self-start sm:self-auto"
              >
                Impact Analysis
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Stat
                label="Daily Management"
                before="4 hours"
                after="10 min"
                change="-96%"
                changeType="positive"
              />
              
              <Stat
                label="Average ROAS"
                before="1.8x"
                after="2.4x"
                change="+33%"
                changeType="positive"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 