"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  SmilePlus,
  Bold,
  Italic,
  Strikethrough,
  Link,
  List,
  ListOrdered,
  Code,
  Undo,
  AtSignIcon as At,
  Image,
  Mic,
  FileText,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  XCircle,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ChatArea() {
  const [showReaction, setShowReaction] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [showReaction])

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return
    setInputValue("")
  }

  const handleAction = () => {
    setShowReaction(true)
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      <ChannelHeader />

      <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
        <div className="mb-6">
          <div className="flex items-start">
            <Avatar className="h-9 w-9 mr-2 mt-1">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="You" />
              <AvatarFallback className="bg-white/10 text-white">Y</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-bold text-white">You</span>
                <span className="ml-2 text-xs text-gray-500">23:15</span>
              </div>

              <div className="mt-1 text-white">Show me my campaign performance</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-start">
            <Avatar className="h-9 w-9 mr-2 mt-1">
              <div className="metallic-logo-container">
                <AvatarImage src="/logo_1.png" alt="XARVIS" />
              </div>
              <AvatarFallback className="bg-[#ff6363] text-white">X</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-bold text-white">XARVIS</span>
                <span className="ml-1 text-xs px-1 bg-black/40 backdrop-blur-md rounded text-gray-400 uppercase border border-white/10">
                  APP
                </span>
                <span className="ml-2 text-xs text-gray-500">8:30 AM</span>
              </div>

              <div className="mt-3 text-white font-inter">
                <div className="mb-4 text-lg">
                  <span className="font-semibold">Good morning! ☀️</span> Your daily campaign briefing is ready.
                </div>

                <div className="mb-2 font-medium">Top performing campaigns:</div>
                <div className="mb-1 pl-2 border-l-2 border-green-500">Summer_Collection_Conversion_US_V2</div>
                <div className="mb-4 pl-2 border-l-2 border-green-500">UGC_Testimonial_Broad_Video_V3</div>

                <div className="mb-2 font-medium">Campaigns needing attention:</div>
                <div className="mb-4 pl-2 border-l-2 border-[#ff6363]">CW10_ABO_Conversion_EU_V1</div>

                <div className="border-t border-white/10 my-4"></div>

                <div className="p-4 bg-black/30 rounded-lg border border-white/10 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-lg">Campaign Details</span>
                    <span className="text-sm text-gray-400">CW10_ABO_Conversion_EU_V1</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-gray-400 text-sm">Cost</div>
                      <div className="text-xl font-semibold">$419.06</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">Results</div>
                      <div className="text-xl font-semibold">33</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">CPA</div>
                      <div className="text-xl font-semibold">$12.70</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">ROAS</div>
                      <div className="text-xl font-semibold">2.03</div>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    <span className="text-gray-400 text-sm mr-2">Trend:</span>
                    <div className="bg-[#ff6363]/20 text-[#ff6363] rounded-full px-2 py-1 flex items-center">
                      <ArrowDown className="h-3 w-3 mr-1" />
                      <span className="text-sm">Declining</span>
                    </div>
                  </div>

                  <div className="mb-4 text-gray-200">
                    <span className="font-medium text-white">Analysis:</span> This campaign has consistently poor
                    performance with a 7-day ROAS of 0.3, showing no signs of improvement despite optimization attempts.
                    With high spend and minimal returns, turning off this ad set is recommended to prevent further losses.
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <ActionButton 
                      type="increase" 
                      percentage="25%" 
                      onClick={handleAction}
                    />
                    <ActionButton 
                      type="turnOff" 
                      onClick={handleAction}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <ActionButton 
                      type="decrease" 
                      percentage="15%" 
                      onClick={handleAction}
                    />
                    <ActionButton 
                      type="more" 
                      onClick={handleAction}
                    />
                  </div>
                </div>

                {showReaction && (
                  <div className="flex mt-2">
                    <div className="inline-flex items-center border border-blue-500 rounded-full px-2 py-1 bg-white/5">
                      <div className="flex items-center justify-center bg-green-500 rounded-sm w-5 h-5 mr-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-sm">1</span>
                    </div>
                    <button className="ml-2 text-gray-400 hover:text-white">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path
                          d="M8 14C8.5 15.5 10 17 12 17C14 17 15.5 15.5 16 14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                        <circle cx="15" cy="9" r="1.5" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10">
        <div className="flex flex-col rounded-md border border-white/10 bg-black/40 backdrop-blur-xl">
          <div className="p-2 min-h-[80px]">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              placeholder="Message #xarvis"
              className="w-full bg-transparent border-none focus:outline-none text-white font-inter"
            />
          </div>

          <div className="flex items-center justify-between p-2 border-t border-white/10">
            <div className="flex items-center space-x-1">
              <FormatButton icon={<Bold className="h-4 w-4" />} />
              <FormatButton icon={<Italic className="h-4 w-4" />} />
              <FormatButton icon={<Strikethrough className="h-4 w-4" />} />
              <FormatButton icon={<Link className="h-4 w-4" />} />
              <FormatButton icon={<List className="h-4 w-4" />} />
              <FormatButton icon={<ListOrdered className="h-4 w-4" />} />
              <FormatButton icon={<Code className="h-4 w-4" />} />
              <FormatButton icon={<Undo className="h-4 w-4" />} />
            </div>

            <div className="flex items-center space-x-1">
              <FormatButton icon={<At className="h-4 w-4" />} />
              <FormatButton icon={<Paperclip className="h-4 w-4" />} />
              <FormatButton icon={<Image className="h-4 w-4" />} />
              <FormatButton icon={<Mic className="h-4 w-4" />} />
              <FormatButton icon={<SmilePlus className="h-4 w-4" />} />
              <Button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
                className={cn(
                  "rounded p-1 h-8 w-8",
                  inputValue.trim() === "" ? "bg-white/5 text-gray-400" : "bg-[#ff6363] text-white hover:bg-[#ff7373]",
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center">
        <span className="text-white font-bold mr-2"># xarvis</span>
        <div className="flex items-center text-xs bg-black/40 backdrop-blur-md rounded px-2 py-1 text-gray-400 border border-white/10">
          <Avatar className="h-4 w-4 mr-1">
            <AvatarFallback className="text-[8px] bg-white/10">1</AvatarFallback>
          </Avatar>
          <span>1</span>
        </div>
        <div className="ml-2 flex items-center text-xs bg-black/40 backdrop-blur-md rounded px-2 py-1 text-gray-400 border border-white/10">
          <span>Huddle</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
          Messages
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
          <FileText className="h-4 w-4 mr-1" />
          Add canvas
        </Button>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  type: 'increase' | 'decrease' | 'turnOff' | 'more'
  percentage?: string
  onClick: () => void
}

function ActionButton({ type, percentage, onClick }: ActionButtonProps) {
  const getButtonStyles = () => {
    switch (type) {
      case 'increase':
        return {
          icon: <ArrowUp className="h-4 w-4" />,
          text: 'Increase',
          className: 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'
        }
      case 'decrease':
        return {
          icon: <ArrowDown className="h-4 w-4" />,
          text: 'Decrease',
          className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20'
        }
      case 'turnOff':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'Turn Off',
          className: 'bg-[#ff6363]/10 text-[#ff6363] border-[#ff6363]/30 hover:bg-[#ff6363]/20'
        }
      case 'more':
        return {
          icon: <MoreHorizontal className="h-4 w-4" />,
          text: 'More',
          className: 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
        }
      default:
        return {
          icon: null,
          text: '',
          className: ''
        }
    }
  }

  const { icon, text, className } = getButtonStyles()

  return (
    <div className="flex">
      {percentage && (
        <div className="border border-white/10 bg-black/30 rounded-l-md px-3 py-2 flex items-center">
          <span>{percentage}</span>
          <ChevronDown className="ml-1 h-4 w-4" />
        </div>
      )}
      <button
        className={cn(
          "border rounded-md px-4 py-2 flex items-center transition-colors",
          percentage ? "rounded-l-none" : "",
          className
        )}
        onClick={onClick}
      >
        {icon && <span className="mr-2">{icon}</span>}
        {text}
      </button>
    </div>
  )
}

interface FormatButtonProps {
  icon: React.ReactNode
}

function FormatButton({ icon }: FormatButtonProps) {
  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/5 rounded">
      {icon}
    </Button>
  )
} 