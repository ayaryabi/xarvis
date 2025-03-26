"use client"

import { Container } from "@/components/0-ui/container/container"
import { Button } from "@/components/0-ui/button"
import { Users, Lightbulb, BarChart, BookOpen, Zap, Eye, Box, Bolt } from "lucide-react"
import { cn } from "@/lib/utils"

export function CostComparisonSection() {
  return (
    <section className="py-24 relative">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The most intelligent media buyer at a<br />
            <span className="text-[#ff6363]">fraction of the cost</span>
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional Approach Card */}
          <div className="relative rounded-xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-xl font-semibold text-center">Traditional Approach</h3>
            </div>
            
            <div>
              <ComparisonItem 
                icon={<Users className="h-5 w-5" />}
                title="Media Buyer"
                subtitle="Campaign Management"
                price="$8,000/mo"
              />
              
              <ComparisonItem 
                icon={<Lightbulb className="h-5 w-5" />}
                title="Creative Strategist"
                subtitle="Ad Design & Copy"
                price="$6,000/mo"
              />
              
              <ComparisonItem 
                icon={<BarChart className="h-5 w-5" />}
                title="Analytics Tools"
                subtitle="Performance Monitoring"
                price="$1,200/mo"
              />
              
              <ComparisonItem 
                icon={<BookOpen className="h-5 w-5" />}
                title="Tracking Tools"
                subtitle="Attribution & Reporting"
                price="$800/mo"
              />
              
              <div className="p-6 border-t border-white/10 flex justify-between items-center">
                <div className="font-semibold text-lg">Total Cost</div>
                <div className="text-2xl font-bold">$16,000/mo</div>
              </div>
            </div>
          </div>
          
          {/* XARVIS Card with glow effect */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363]/30 to-[#ff3939]/30 rounded-xl blur opacity-20"></div>
            
            <div className="relative rounded-xl border border-[rgba(255,99,99,0.3)] bg-[rgba(40,0,0,0.8)] overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-center">XARVIS and His Crew</h3>
              </div>
              
              <div>
                <ComparisonItem 
                  icon={
                    <div className="bg-[rgba(80,0,0,0.4)] rounded-full h-10 w-10 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-[#ff6363]" />
                    </div>
                  }
                  title="Agent Orion"
                  subtitle="Campaign Management & Optimization"
                  customIcon
                />
                
                <ComparisonItem 
                  icon={
                    <div className="bg-[rgba(80,0,0,0.4)] rounded-full h-10 w-10 flex items-center justify-center">
                      <Bolt className="h-5 w-5 text-[#ff6363]" />
                    </div>
                  }
                  title="Agent Apollo"
                  subtitle="Creative Generation & Testing"
                  customIcon
                />
                
                <ComparisonItem 
                  icon={
                    <div className="bg-[rgba(80,0,0,0.4)] rounded-full h-10 w-10 flex items-center justify-center">
                      <Box className="h-5 w-5 text-[#ff6363]" />
                    </div>
                  }
                  title="Agent Cipher"
                  subtitle="Analytics & Reporting"
                  customIcon
                />
                
                <ComparisonItem 
                  icon={
                    <div className="bg-[rgba(80,0,0,0.4)] rounded-full h-10 w-10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-[#ff6363]" />
                    </div>
                  }
                  title="Agent Nexus"
                  subtitle="Cross-Platform Integration"
                  customIcon
                />
                
                <div className="p-6 border-t border-white/10 flex justify-between items-center">
                  <div className="font-semibold text-lg">Total Cost</div>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-[#ff6363]">$2,000/mo</div>
                    <div className="text-xs bg-[#ff6363]/10 text-[#ff6363] py-0.5 px-2 rounded">-88%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center">
          <Button variant="default" size="lg" className="px-8 bg-gradient-to-r from-[#ff6363] to-[#ff3939] text-white hover:from-[#ff7373] hover:to-[#ff4949]">
            Hire XARVIS and His Crew →
          </Button>
          <p className="text-sm text-gray-400 mt-4">
            Based on managing $200K monthly ad spend across multiple platforms
          </p>
        </div>
      </Container>
    </section>
  )
}

// Helper component for comparison items
function ComparisonItem({ 
  icon, 
  title, 
  subtitle, 
  price,
  customIcon = false
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  price?: string;
  customIcon?: boolean;
}) {
  return (
    <div className="p-6 border-b border-white/10 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className={cn(
          "flex-shrink-0 rounded-full flex items-center justify-center",
          customIcon ? "" : "h-10 w-10 bg-black/60 border border-white/10"
        )}>
          {icon}
        </div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-gray-400">{subtitle}</div>
        </div>
      </div>
      {price && <div className="text-xl font-semibold">{price}</div>}
    </div>
  )
} 