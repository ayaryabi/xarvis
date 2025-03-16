import type React from "react"
import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

interface MacWindowProps {
  children: React.ReactNode
  className?: string
}

export function MacWindow({ children, className }: MacWindowProps) {
  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative bg-black/40 backdrop-blur-xl",
        className,
      )}
    >
      <div className="bg-black/60 backdrop-blur-xl px-4 py-2 flex items-center border-b border-white/10">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FEBC2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="flex items-center space-x-2 px-4 py-1 rounded-md bg-black/40 backdrop-blur-xl border border-white/10 text-xs text-gray-400">
            <Circle className="h-2 w-2 fill-green-500 text-green-500" />
            <span>xarvis.slack.com</span>
          </div>
        </div>
      </div>
      <div className="h-[600px] overflow-hidden">{children}</div>
    </div>
  )
}

