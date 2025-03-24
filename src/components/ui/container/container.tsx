"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface ContainerProps {
  className?: string
  children: React.ReactNode
}

export function Container({
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "w-[90%] max-w-6xl mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}