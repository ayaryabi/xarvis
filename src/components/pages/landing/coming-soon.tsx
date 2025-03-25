"use client"

import React from "react"
import { Container } from "@/components/ui/container/container"
import { Card } from "@/components/ui/card"
import { Star, Target, BarChart } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconProps {
  className?: string;
}

interface AgentCardProps {
  icon: React.ReactNode
  name: string
  tagline: string
  description: string
}

function AgentCard({ icon, name, tagline, description }: AgentCardProps) {
  return (
    <Card 
      variant="feature"
      glowOnHover={true}
      glowColor="from-[#ff6363] to-[#ff3939]"
      className="h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-[#ff6363]/10 flex items-center justify-center">
          {React.isValidElement(icon) && 
            React.cloneElement(icon as React.ReactElement<IconProps>, { 
              className: "h-6 w-6 text-[#ff6363]" 
            })
          }
        </div>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-[#ff6363] mr-2 animate-pulse"></div>
          <span className="text-xs font-medium text-white/70 tracking-wider bg-gradient-to-r from-[#ff6363] to-[#ff3939] bg-clip-text text-transparent">
            COMING SOON
          </span>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <h4 className="text-[#ff6363] text-sm font-medium mb-3">{tagline}</h4>
      <p className="text-gray-400">{description}</p>
    </Card>
  )
}

export function ComingSoonSection() {
  return (
    <section className="py-24 relative">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Coming soon
          </h2>
          <p className="text-xl text-gray-400">
            Meet the rest of the XARVIS Strike Team
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <AgentCard 
            icon={<Star />}
            name="Agent Apollo"
            tagline="The Creative Mastermind"
            description="Analyzes winning creatives & generates new ad scripts. Identifies trends in top-performing ads and helps craft high-converting ad variations."
          />
          
          <AgentCard 
            icon={<Target />}
            name="Agent Nexus"
            tagline="The Growth Engine"
            description="Autonomous campaign creation & audience expansion. Finds new high-value audiences & segments and scales best-performing ad sets without manual input."
          />
          
          <AgentCard 
            icon={<BarChart />}
            name="Agent Cipher"
            tagline="The AI Analyst"
            description="Pulls instant insights & performance breakdowns. Answers any ad-related questions directly in Slack and tracks key performance shifts and alerts you proactively."
          />
        </div>
      </Container>
    </section>
  )
} 