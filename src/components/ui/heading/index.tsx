"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface HeadingProps {
  children: React.ReactNode
  as?: "h1" | "h2" | "h3" | "h4"
  className?: string
  gradient?: boolean
  size?: "sm" | "md" | "lg" | "xl"
}

export function Heading({
  children,
  as = "h2",
  className,
  gradient = false,
  size = "lg"
}: HeadingProps) {
  const Component = as
  
  const sizeClasses = {
    sm: "text-xl md:text-2xl",
    md: "text-2xl md:text-3xl",
    lg: "text-3xl md:text-5xl",
    xl: "text-4xl md:text-7xl"
  }

  return (
    <Component
      className={cn(
        "font-bold leading-tight",
        sizeClasses[size],
        gradient && "bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80",
        className
      )}
    >
      {children}
    </Component>
  )
} 