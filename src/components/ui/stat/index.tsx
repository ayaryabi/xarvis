"use client"

import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface StatProps {
  label: string
  before: string
  after: string
  change: string
  changeType?: "positive" | "negative" | "neutral"
  className?: string
}

export function Stat({
  label,
  before,
  after,
  change,
  changeType = "positive",
  className
}: StatProps) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      <div className="text-gray-400 text-sm mb-1">{label}</div>
      <div className="flex items-center">
        <span className="text-white font-medium text-lg">{before}</span>
        <ArrowRight className="mx-2 h-4 w-4 text-gray-500" />
        <span className="text-[#ff6363] font-bold text-lg">{after}</span>
        <span className="ml-2 bg-[#ff6363]/10 text-[#ff6363] text-xs py-0.5 px-1.5 rounded-sm">
          {change}
        </span>
      </div>
    </div>
  )
} 