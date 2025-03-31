"use client"

import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

interface FeatureCardProps {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  className?: string
}

export function FeatureCard({ 
  number, 
  title, 
  description, 
  icon,
  className
}: FeatureCardProps) {
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
        transitionDelay: `${number * 150}ms`,
      }}
    >
      <Card 
        variant="feature" 
        glowOnHover={true}
        glowColor="from-[#ff6363] to-[#ff3939]"
        className="p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-[#ff6363]/10 text-[#ff6363] border border-[#ff6363]/30">
            {icon}
          </div>
          <div className="flex items-center">
            <span className="text-sm font-medium text-white/70 tracking-wider">{`0${number}`}</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-bold mb-2">
            {title}
          </h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </Card>
    </div>
  )
} 