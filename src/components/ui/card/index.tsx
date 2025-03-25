"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cardVariants } from "./variants"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "results"
  glowOnHover?: boolean
  permanentGlow?: boolean
  glowColor?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export function Card({
  className,
  variant,
  glowOnHover = false,
  permanentGlow = false,
  glowColor = "from-[#ff6363]/30 to-[#ff3939]/30",
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }

  return (
    <div className="relative group">
      {/* Permanent glow effect - identical to results card */}
      {permanentGlow && (
        <div className={cn(
          "absolute -inset-0.5 rounded-xl blur opacity-20 bg-gradient-to-r",
          glowColor
        )}></div>
      )}
      
      {/* Hover glow effect */}
      {glowOnHover && (
        <div className={cn(
          "absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-r",
          glowColor
        )}></div>
      )}
      
      <div
        className={cn(
          cardVariants({ variant, glowOnHover: false }),
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
} 