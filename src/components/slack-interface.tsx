"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { Header } from "@/components/header"
import { useMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function SlackInterface() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  // Update sidebar state when screen size changes
  useEffect(() => {
    setSidebarOpen(!isMobile)
  }, [isMobile])

  return (
    <div className="flex h-full overflow-hidden bg-[#0A0A0A]">
      {/* Sidebar with conditional rendering for mobile */}
      {(sidebarOpen || !isMobile) && (
        <Sidebar 
          className={cn(
            isMobile ? "absolute z-20 h-full" : "w-64",
            !sidebarOpen && "hidden"
          )} 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}

      {/* Overlay to close sidebar on mobile when clicking outside */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />
        <ChatArea />
      </div>
    </div>
  )
}

// Helper function for conditional class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
} 