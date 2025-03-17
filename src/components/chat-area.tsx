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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ChatArea() {
  const [showReaction, setShowReaction] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [activeMessageId, setActiveMessageId] = useState<number | null>(null)

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

              <div className="mt-1 text-white">sdfdsffsdfsdf</div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-start">
            <Avatar className="h-9 w-9 mr-2 mt-1">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="XARVIS" />
              <AvatarFallback className="bg-[#ff6363] text-white">X</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-bold text-white">XARVIS</span>
                <span className="ml-1 text-xs px-1 bg-black/40 backdrop-blur-md rounded text-gray-400 uppercase border border-white/10">
                  APP
                </span>
                <span className="ml-2 text-xs text-gray-500">Friday at 11:29 PM</span>
              </div>

              <div className="mt-3 text-white">
                <div className="mb-2">CW10_ABO_Conversion_EU_V1</div>
                <div className="mb-4">UGC_Libby_Snacking_Broad_Video_V2</div>

                <div className="border-t border-white/10 my-4"></div>

                <div className="mb-1">
                  <span className="font-bold">Cost:</span> $419.06
                </div>
                <div className="mb-1">
                  <span className="font-bold">Results:</span> 33
                </div>
                <div className="mb-1">
                  <span className="font-bold">CPA:</span> $12.70
                </div>
                <div className="mb-1">
                  <span className="font-bold">ROAS:</span> 2.03
                </div>

                <div className="flex items-center mb-4 mt-3">
                  <span className="font-bold mr-2">Trend:</span>
                  <div className="bg-gray-500 rounded p-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 20L12 4"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 13L12 20L19 13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="font-bold text-gray-300">XARVIS:</span> This campaign has consistently poor
                  performance with a 7-day ROAS of 0.3, showing no signs of improvement despite optimization attempts.
                  With high spend and minimal returns, turning off this ad set is recommended to prevent further losses.
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <div className="flex">
                    <div className="border border-white/20 bg-white/5 rounded-l-md px-3 py-2 flex items-center">
                      <span>25%</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                    <button
                      className="border border-white/20 bg-white/5 rounded-r-md px-4 py-2 hover:bg-white/10"
                      onClick={handleAction}
                    >
                      Increase
                    </button>
                  </div>

                  <button
                    className="border border-white/10 bg-[#e01e5a] text-white rounded-md px-4 py-2 hover:bg-[#e01e5a]/90"
                    onClick={handleAction}
                  >
                    Turn Off
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex">
                    <div className="border border-white/20 bg-white/5 rounded-l-md px-3 py-2 flex items-center">
                      <span>15%</span>
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </div>
                    <button
                      className="border border-white/20 bg-white/5 rounded-r-md px-4 py-2 hover:bg-white/10"
                      onClick={handleAction}
                    >
                      Decrease
                    </button>
                  </div>

                  <button
                    className="border border-white/20 bg-white/5 rounded-md px-4 py-2 hover:bg-white/10"
                    onClick={handleAction}
                  >
                    More
                  </button>
                </div>

                <div className="border-t border-white/10 my-4"></div>

                {showReaction && (
                  <div className="flex mt-2">
                    <div className="inline-flex items-center border border-blue-500 rounded-full px-2 py-1 bg-white/5">
                      <div className="flex items-center justify-center bg-green-500 rounded-sm w-5 h-5 mr-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              className="w-full bg-transparent border-none focus:outline-none text-white"
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