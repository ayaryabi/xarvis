"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cardVariants } from "./variants"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "feature" | "results"
  glowOnHover?: boolean
  glowColor?: string
  padding?: "none" | "sm" | "md" | "lg"
}

export function Card({
  className,
  variant,
  glowOnHover = false,
  glowColor = "from-[#ff6363] to-[#ff3939]",
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
      {/* Glow effect */}
      {glowOnHover && (
        <div className={cn(
          "absolute -inset-0.5 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity bg-gradient-to-r",
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