"use client"

import { cn } from "@/lib/utils"

interface GradientBackgroundProps {
  className?: string
  variant?: "hero" | "simple" | "subtle"
}

export function GradientBackground({ 
  className,
  variant = "hero"
}: GradientBackgroundProps) {
  const variants = {
    hero: (
      <>
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-r from-[#ff6363]/30 to-transparent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-l from-[#ff6363]/30 to-transparent rounded-full blur-[120px]"></div>
      </>
    ),
    simple: (
      <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-gradient-to-r from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
    ),
    subtle: (
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
    )
  }

  return (
    <div className={cn("absolute inset-0 z-0", className)}>
      {variants[variant]}
    </div>
  )
} 