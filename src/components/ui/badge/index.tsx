"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "primary" | "outline" | "dark"
}

export function Badge({
  children,
  className,
  variant = "default"
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white/5 border-white/10 text-gray-300",
    primary: "bg-white/5 border-white/10 text-[#ff6363]",
    outline: "bg-transparent border-white/10 text-gray-300",
    dark: "bg-black/60 border-[#ff6363]/30 text-[#ff6363]"
  }

  return (
    <div className={cn(
      "inline-block px-4 py-1 rounded-full backdrop-blur-lg border text-sm",
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  )
} 