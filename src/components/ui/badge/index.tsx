"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface BadgeProps {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
  variant?: "default" | "primary" | "outline" | "dark"
}

// Type for elements that accept className prop
interface ClassNameProps {
  className?: string;
}

export function Badge({
  children,
  icon,
  className,
  variant = "default"
}: BadgeProps) {
  const variantStyles = {
    default: "bg-white/5 border-white/10 text-gray-300",
    primary: "bg-white/5 border-white/10 text-[#ff6363]",
    outline: "bg-transparent border-white/10 text-gray-300",
    dark: "bg-black/60 border border-[#ff6363] text-[#ff6363] shadow-[0_0_10px_rgba(255,99,99,0.3)] hover:shadow-[0_0_15px_rgba(255,99,99,0.4)] transition-shadow"
  }

  return (
    <div className={cn(
      "inline-flex items-center px-4 py-1 rounded-full backdrop-blur-lg border text-sm",
      variantStyles[variant],
      className
    )}>
      {icon && React.isValidElement<ClassNameProps>(icon) && 
        React.cloneElement(icon, {
          className: cn('h-4 w-4 mr-2', icon.props.className)
        })
      }
      <span>{children}</span>
    </div>
  )
} 