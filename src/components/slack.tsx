"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ChatArea } from "@/components/chat-area"
import { Header } from "@/components/header"
import { MobileNav } from "@/components/mobile-nav"
import { useMobile } from "@/hooks/use-mobile"

export function Slack() {
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  return (
    <div className="flex h-screen overflow-hidden">
      {isMobile ? (
        <MobileNav isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      ) : (
        <Sidebar className={sidebarOpen ? "w-64" : "w-0"} />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} isMobile={isMobile} />
        <ChatArea />
      </div>
    </div>
  )
}

