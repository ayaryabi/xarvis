"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Plus, Hash, MessageSquare, Home, Activity, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  const [activeChannel, setActiveChannel] = useState("xarvis")

  return (
    <div
      className={cn(
        "bg-black/60 backdrop-blur-xl text-white flex-shrink-0 overflow-y-auto h-full border-r border-white/10",
        className,
        !isOpen && "hidden",
      )}
    >
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center justify-between p-2 rounded hover:bg-white/5 cursor-pointer w-full">
          <div className="font-semibold text-white flex items-center">
            XARVIS
            <ChevronDown className="h-4 w-4 ml-1" />
          </div>
        </div>
      </div>

      <div className="px-3 py-2">
        <SidebarButton icon={<Home className="h-4 w-4" />} label="Home" />
        <SidebarButton icon={<MessageSquare className="h-4 w-4" />} label="DMs" />
        <SidebarButton icon={<Activity className="h-4 w-4" />} label="Activity" />
        <SidebarButton icon={<MoreHorizontal className="h-4 w-4" />} label="More" />
      </div>

      <div className="px-3 py-2">
        <SidebarSection title="Channels">
          <ChannelItem
            icon={<Hash />}
            name="all-arian"
            isActive={activeChannel === "all-arian"}
            onClick={() => setActiveChannel("all-arian")}
          />
          <ChannelItem
            icon={<Hash />}
            name="marketing"
            isActive={activeChannel === "marketing"}
            onClick={() => setActiveChannel("marketing")}
          />
          <ChannelItem
            icon={<Hash />}
            name="xarvis"
            isActive={activeChannel === "xarvis"}
            onClick={() => setActiveChannel("xarvis")}
          />
          <ChannelItem
            icon={<Hash />}
            name="social"
            isActive={activeChannel === "social"}
            onClick={() => setActiveChannel("social")}
          />
          <div className="flex items-center px-2 py-1 text-sm text-gray-400 hover:text-white">
            <Plus className="h-3 w-3 mr-1" />
            <span>Add channels</span>
          </div>
        </SidebarSection>

        <SidebarSection title="Direct Messages">
          <DirectMessageItem
            name="XARVIS Bot"
            status="online"
            isActive={activeChannel === "xarvis-bot"}
            onClick={() => setActiveChannel("xarvis-bot")}
          />
          <DirectMessageItem
            name="Arian"
            status="online"
            isActive={activeChannel === "arian"}
            onClick={() => setActiveChannel("arian")}
            subtitle="you"
          />
          <div className="flex items-center px-2 py-1 text-sm text-gray-400 hover:text-white">
            <Plus className="h-3 w-3 mr-1" />
            <span>Add coworkers</span>
          </div>
        </SidebarSection>

        <SidebarSection title="Apps">
          <AppItem name="XARVIS" isActive={activeChannel === "xarvis"} onClick={() => setActiveChannel("xarvis")} />
          <div className="flex items-center px-2 py-1 text-sm text-gray-400 hover:text-white">
            <Plus className="h-3 w-3 mr-1" />
            <span>Add apps</span>
          </div>
        </SidebarSection>
      </div>
    </div>
  )
}

interface SidebarButtonProps {
  icon: React.ReactNode
  label: string
}

function SidebarButton({ icon, label }: SidebarButtonProps) {
  return (
    <div className="flex flex-col items-start py-2 px-2 hover:bg-white/5 rounded cursor-pointer">
      <div className="flex flex-col items-center text-gray-400 hover:text-white">
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </div>
    </div>
  )
}

interface SidebarSectionProps {
  title: string
  children: React.ReactNode
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center text-sm font-medium text-gray-400">
          <ChevronDown className={cn("h-3 w-3 mr-1", !isExpanded && "transform -rotate-90")} />
          <span>{title}</span>
        </div>
      </div>

      {isExpanded && <div className="space-y-1">{children}</div>}
    </div>
  )
}

interface ChannelItemProps {
  icon: React.ReactNode
  name: string
  isActive: boolean
  onClick: () => void
}

function ChannelItem({ icon, name, isActive, onClick }: ChannelItemProps) {
  return (
    <div
      className={cn(
        "flex items-center px-2 py-1 rounded text-sm cursor-pointer",
        isActive ? "bg-[#ff6363] text-white" : "text-gray-400 hover:text-white",
      )}
      onClick={onClick}
    >
      <div className="h-4 w-4 mr-2 flex items-center justify-center text-gray-400">{icon}</div>
      <span>{name}</span>
    </div>
  )
}

interface DirectMessageItemProps {
  name: string
  status?: "online" | "away" | "offline"
  isActive: boolean
  onClick: () => void
  subtitle?: string
}

function DirectMessageItem({ name, status, isActive, onClick, subtitle }: DirectMessageItemProps) {
  return (
    <div
      className={cn(
        "flex items-center px-2 py-1 rounded text-sm cursor-pointer",
        isActive ? "bg-[#ff6363] text-white" : "text-gray-400 hover:text-white",
      )}
      onClick={onClick}
    >
      <div className="relative mr-2">
        <div className="h-4 w-4 rounded-full bg-gray-500"></div>
        {status === "online" && <div className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-green-500"></div>}
      </div>
      <span>{name}</span>
      {subtitle && <span className="ml-1 text-xs text-gray-400">{subtitle}</span>}
    </div>
  )
}

interface AppItemProps {
  name: string
  isActive: boolean
  onClick: () => void
}

function AppItem({ name, isActive, onClick }: AppItemProps) {
  return (
    <div
      className={cn(
        "flex items-center px-2 py-1 rounded text-sm cursor-pointer",
        isActive ? "bg-[#ff6363] text-white" : "text-gray-400 hover:text-white",
      )}
      onClick={onClick}
    >
      <Avatar className="h-4 w-4 mr-2">
        <AvatarImage src="/placeholder.svg?height=16&width=16" alt={name} />
        <AvatarFallback className="text-[8px] bg-[#ff6363]/20 text-[#ff6363]">{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span>{name}</span>
    </div>
  )
}

