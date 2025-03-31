"use client"

import { Logo } from "@/components/common/logo"

interface VersionTagProps {
  version: string
  text: string
}

export function VersionTag({ version, text }: VersionTagProps) {
  return (
    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black/40 backdrop-blur-xl text-sm text-gray-400 px-6 py-2 rounded-full border border-white/10 shadow-lg">
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Logo size="sm" effect="holographic" />
        <span>{version} • {text}</span>
      </div>
    </div>
  )
} 