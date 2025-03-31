"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  effect?: "metallic" | "holographic" | "none" 
}

export function Logo({ 
  className,
  size = "md",
  effect = "metallic"
}: LogoProps) {
  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  const effectClass = {
    metallic: "metallic-logo-container",
    holographic: "holographic-shimmer",
    none: ""
  }

  return (
    <div className={cn(
      "rounded-full overflow-hidden flex items-center justify-center",
      effectClass[effect],
      sizeClass[size],
      className
    )}>
      <img 
        src="/logo.png" 
        alt="XARVIS" 
        className="h-full w-full object-cover" 
      />
    </div>
  )
}