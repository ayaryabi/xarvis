"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ 
  className,
  size = "md"
}: LogoProps) {
  const sizeClass = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10"
  }

  return (
    <div className={cn(
      "rounded-full overflow-hidden flex items-center justify-center",
      sizeClass[size],
      className
    )}>
      <img 
        src="/logo_1.png" 
        alt="XARVIS" 
        className="h-full w-full object-cover" 
      />
    </div>
  )
}