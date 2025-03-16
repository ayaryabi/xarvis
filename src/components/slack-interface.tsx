"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { Header } from "@/components/header"
import { useMobile } from "@/hooks/use-mobile"

export function SlackInterface() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-full overflow-hidden bg-[#0A0A0A]">
      <Sidebar className={sidebarOpen ? "w-64" : "w-0"} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />
        <ChatArea />
      </div>
    </div>
  )
}

