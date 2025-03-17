"use client"

import { Clock, HelpCircle, Bell, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

export function Header({ onMenuClick, isMobile }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-12 px-4 bg-black/60 backdrop-blur-xl text-white border-b border-white/10">
      <div className="flex items-center">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="mr-2 text-white hover:bg-white/10">
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Clock className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
} 