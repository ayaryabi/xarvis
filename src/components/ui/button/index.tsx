"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./variants"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "white" | "ghost" | "outline" | "gradient"
  size?: "default" | "lg" | "xl" | "full"
  asChild?: boolean
}

export function Button({
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}