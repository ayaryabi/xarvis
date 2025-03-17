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
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function ChatArea() {
  const [showReaction, setShowReaction] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")
  const [actionTaken, setActionTaken] = useState<{
    campaignId: string;
    action: string;
    message: string;
  } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalCampaign, setModalCampaign] = useState<string | null>(null)

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return
    setInputValue("")
  }

  const handleAction = (campaignId: string, action: string, message: string) => {
    setActionTaken({ campaignId, action, message })
    setShowReaction(true)
    
    if (action === 'more') {
      setModalCampaign(campaignId)
      setShowModal(true)
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
      <ChannelHeader />

      <div className="flex-1 overflow-y-auto p-4 pb-[140px] hide-scrollbar scrollbar-hide">
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

                {/* Campaign 1 - Turn Off */}
                <CampaignCard
                  id="Facebook Dynamic Product Ads V1"
                  cost="$419.06"
                  results="33"
                  cpa="$12.70"
                  roas="0.3"
                  trend="declining"
                  analysis="This campaign has consistently poor performance with a 7-day ROAS of 0.3, showing no signs of improvement despite optimization attempts."
                  recommendation="turnOff"
                  actionTaken={actionTaken}
                  onAction={handleAction}
                />

                {/* Campaign 2 - Increase */}
                <CampaignCard
                  id="Instagram Collection Carousel US V2"
                  cost="$1,245.32"
                  results="156"
                  cpa="$7.98"
                  roas="3.2"
                  trend="improving"
                  analysis="This campaign is performing exceptionally well with consistent ROAS above 3.0 for the past 10 days. There's potential to scale."
                  recommendation="increase"
                  actionTaken={actionTaken}
                  onAction={handleAction}
                />

                {/* Campaign 3 - Decrease */}
                <CampaignCard
                  id="TikTok Influencer Testimonial Video V3"
                  cost="$876.50"
                  results="42"
                  cpa="$20.87"
                  roas="1.4"
                  trend="stable"
                  analysis="This campaign is showing moderate performance but the CPA is higher than target. Consider reducing budget to optimize efficiency."
                  recommendation="decrease"
                  actionTaken={actionTaken}
                  onAction={handleAction}
                />

                {actionTaken && (
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

      {showModal && modalCampaign && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#121212] border border-white/10 rounded-lg max-w-2xl w-full p-5 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">{modalCampaign} - Detailed Analytics</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm text-gray-400 mb-1">Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Impressions:</span>
                    <span className="text-white text-sm">124,587</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">CTR:</span>
                    <span className="text-white text-sm">2.34%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Conversion Rate:</span>
                    <span className="text-white text-sm">3.77%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Avg. Order Value:</span>
                    <span className="text-white text-sm">$68.23</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-black/40 rounded-lg p-4 border border-white/10">
                <h4 className="text-sm text-gray-400 mb-1">Audience Insights</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Top Age Group:</span>
                    <span className="text-white text-sm">25-34 (42%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Gender Split:</span>
                    <span className="text-white text-sm">F: 58% | M: 42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Top Device:</span>
                    <span className="text-white text-sm">Mobile (76%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Top Location:</span>
                    <span className="text-white text-sm">New York (18%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/10 mb-6">
              <h4 className="text-sm text-gray-400 mb-3">7-Day Performance Trend</h4>
              <div className="h-40 flex items-end justify-between gap-2">
                {[35, 42, 28, 56, 48, 65, 72].map((value, index) => (
                  <div key={index} className="relative group flex flex-col items-center">
                    <span className="absolute -top-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      {value}
                    </span>
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-sm w-8"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-1">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-black/40 rounded-lg p-4 border border-white/10 mb-6">
              <h4 className="text-sm text-gray-400 mb-2">AI Recommendations</h4>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Consider allocating more budget to weekend hours, which show 37% higher conversion rates.</span>
                </li>
                <li className="flex">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Test new creative variations featuring product-in-use imagery, as similar campaigns have shown a 22% CTR increase.</span>
                </li>
                <li className="flex">
                  <span className="text-green-400 mr-2">•</span>
                  <span>Expand targeting to include lookalike audiences based on your top 5% of customers.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 border border-white/10 rounded-md text-sm text-gray-300 hover:bg-white/5">
                Export Data
              </button>
              <button className="px-4 py-2 bg-[#ff6363] rounded-md text-sm text-white hover:bg-[#ff7373]" onClick={() => setShowModal(false)}>
                Apply Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 z-10 px-4 py-3 bg-[#0A0A0A] border-t border-white/10" style={{ height: "120px" }}>
        <div className="flex flex-col rounded-md border border-white/10 bg-black/40 backdrop-blur-xl h-full">
          <div className="p-3 flex items-center flex-1">
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

          <div className="flex items-center justify-between px-3 py-2 border-t border-white/10">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              <FormatButton icon={<Bold className="h-4 w-4" />} />
              <FormatButton icon={<Italic className="h-4 w-4" />} />
              <FormatButton icon={<Strikethrough className="h-4 w-4" />} />
              <FormatButton icon={<Link className="h-4 w-4" />} />
              <FormatButton icon={<List className="h-4 w-4" />} />
              <FormatButton icon={<ListOrdered className="h-4 w-4" />} />
              <FormatButton icon={<Code className="h-4 w-4" />} />
              <FormatButton icon={<Undo className="h-4 w-4" />} />
            </div>

            <div className="flex items-center space-x-3 pl-2">
              <FormatButton icon={<At className="h-5 w-5" />} />
              <FormatButton icon={<Paperclip className="h-5 w-5" />} />
              <FormatButton icon={<Image className="h-5 w-5" />} />
              <FormatButton icon={<Mic className="h-5 w-5" />} />
              <FormatButton icon={<SmilePlus className="h-5 w-5" />} />
              <Button
                onClick={handleSendMessage}
                disabled={inputValue.trim() === ""}
                className={cn(
                  "rounded-lg p-2 h-11 w-11 flex-shrink-0",
                  inputValue.trim() === "" ? "bg-white/5 text-gray-400" : "bg-[#ff6363] text-white hover:bg-[#ff7373]",
                )}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface CampaignCardProps {
  id: string
  cost: string
  results: string
  cpa: string
  roas: string
  trend: 'improving' | 'declining' | 'stable'
  analysis: string
  recommendation: 'increase' | 'decrease' | 'turnOff'
  actionTaken: {
    campaignId: string;
    action: string;
    message: string;
  } | null
  onAction: (campaignId: string, action: string, message: string) => void
}

function CampaignCard({
  id,
  cost,
  results,
  cpa,
  roas,
  trend,
  analysis,
  recommendation,
  actionTaken,
  onAction
}: CampaignCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'improving':
        return (
          <div className="bg-green-500/20 text-green-400 rounded-full px-2 py-1 flex items-center">
            <ArrowUp className="h-3 w-3 mr-1" />
            <span className="text-xs">Improving</span>
          </div>
        )
      case 'declining':
        return (
          <div className="bg-[#ff6363]/20 text-[#ff6363] rounded-full px-2 py-1 flex items-center">
            <ArrowDown className="h-3 w-3 mr-1" />
            <span className="text-xs">Declining</span>
          </div>
        )
      case 'stable':
        return (
          <div className="bg-yellow-500/20 rounded-full px-2 py-1 flex items-center">
            <span className="h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
            <span className="text-xs text-yellow-400">Stable</span>
          </div>
        )
      default:
        return null
    }
  }

  const isActionTaken = actionTaken && actionTaken.campaignId === id

  return (
    <div className="p-3 bg-black/30 rounded-lg border border-white/10 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-400">{id}</span>
        {getTrendIcon()}
      </div>
      
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div>
          <div className="text-gray-400 text-xs">Cost</div>
          <div className="text-sm font-semibold">{cost}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">Results</div>
          <div className="text-sm font-semibold">{results}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">CPA</div>
          <div className="text-sm font-semibold">{cpa}</div>
        </div>
        <div>
          <div className="text-gray-400 text-xs">ROAS</div>
          <div className="text-sm font-semibold">{roas}</div>
        </div>
      </div>

      <div className="mb-3 text-gray-200 text-sm">
        <span className="font-medium text-white">Analysis:</span> {analysis}
      </div>

      <div className="flex flex-wrap gap-2 mb-1">
        {recommendation === 'increase' ? (
          <ActionButton 
            type="increase" 
            percentage="25%" 
            onClick={() => onAction(id, 'increase', 'Budget increased by 25%')}
            isHighlighted={recommendation === 'increase'}
            isCompleted={!!(isActionTaken && actionTaken.action === 'increase')}
          />
        ) : (
          <ActionButton 
            type="increase" 
            percentage="25%" 
            onClick={() => onAction(id, 'increase', 'Budget increased by 25%')}
            isHighlighted={false}
            isCompleted={!!(isActionTaken && actionTaken.action === 'increase')}
          />
        )}
        
        {recommendation === 'turnOff' ? (
          <ActionButton 
            type="turnOff" 
            onClick={() => onAction(id, 'turnOff', 'Campaign turned off')}
            isHighlighted={recommendation === 'turnOff'}
            isCompleted={!!(isActionTaken && actionTaken.action === 'turnOff')}
          />
        ) : (
          <ActionButton 
            type="turnOff" 
            onClick={() => onAction(id, 'turnOff', 'Campaign turned off')}
            isHighlighted={false}
            isCompleted={!!(isActionTaken && actionTaken.action === 'turnOff')}
          />
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-1">
        {recommendation === 'decrease' ? (
          <ActionButton 
            type="decrease" 
            percentage="15%" 
            onClick={() => onAction(id, 'decrease', 'Budget decreased by 15%')}
            isHighlighted={recommendation === 'decrease'}
            isCompleted={!!(isActionTaken && actionTaken.action === 'decrease')}
          />
        ) : (
          <ActionButton 
            type="decrease" 
            percentage="15%" 
            onClick={() => onAction(id, 'decrease', 'Budget decreased by 15%')}
            isHighlighted={false}
            isCompleted={!!(isActionTaken && actionTaken.action === 'decrease')}
          />
        )}
        
        <ActionButton 
          type="more" 
          onClick={() => onAction(id, 'more', 'Showing more options')}
          isHighlighted={false}
          isCompleted={!!(isActionTaken && actionTaken.action === 'more')}
        />
      </div>

      {isActionTaken && (
        <div className="mt-2 text-sm flex items-center text-gray-300">
          <Check className="h-4 w-4 text-green-500 mr-1" />
          {actionTaken.message}
        </div>
      )}
    </div>
  )
}

function ChannelHeader() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="flex items-center">
        <span className="text-white font-bold mr-2"># xarvis</span>
        <div className="flex items-center text-xs bg-black/40 backdrop-blur-md rounded px-2 py-1 text-gray-500 border border-white/10">
          <Avatar className="h-4 w-4 mr-1">
            <AvatarFallback className="text-[8px] bg-white/10">1</AvatarFallback>
          </Avatar>
          <span>1</span>
        </div>
        <div className="ml-2 flex items-center text-xs bg-black/40 backdrop-blur-md rounded px-2 py-1 text-gray-500 border border-white/10">
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
  isHighlighted: boolean
  isCompleted: boolean
}

function ActionButton({ type, percentage, onClick, isHighlighted, isCompleted }: ActionButtonProps) {
  const getButtonStyles = () => {
    const baseStyle = 'border-white/10 bg-black/20 text-gray-300 hover:bg-white/10'
    
    if (isCompleted) {
      return {
        icon: <Check className="h-4 w-4" />,
        text: getActionText(),
        className: 'bg-green-500/10 text-green-400 border-green-500/30'
      }
    }
    
    switch (type) {
      case 'increase':
        return {
          icon: <ArrowUp className="h-4 w-4" />,
          text: 'Increase',
          className: isHighlighted 
            ? 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20' 
            : baseStyle
        }
      case 'decrease':
        return {
          icon: <ArrowDown className="h-4 w-4" />,
          text: 'Decrease',
          className: isHighlighted 
            ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20' 
            : baseStyle
        }
      case 'turnOff':
        return {
          icon: <XCircle className="h-4 w-4" />,
          text: 'Turn Off',
          className: isHighlighted 
            ? 'bg-[#ff6363]/10 text-[#ff6363] border-[#ff6363]/30 hover:bg-[#ff6363]/20' 
            : baseStyle
        }
      case 'more':
        return {
          icon: <MoreHorizontal className="h-4 w-4" />,
          text: 'More',
          className: baseStyle
        }
      default:
        return {
          icon: null,
          text: '',
          className: ''
        }
    }
  }

  const getActionText = () => {
    switch (type) {
      case 'increase': return 'Increased'
      case 'decrease': return 'Decreased'
      case 'turnOff': return 'Turned Off'
      case 'more': return 'More'
      default: return ''
    }
  }

  const { icon, text, className } = getButtonStyles()

  return (
    <div className="flex">
      {percentage && (
        <div className="border border-white/10 bg-black/20 rounded-l-md px-2 py-1 flex items-center text-xs">
          <span>{percentage}</span>
          <ChevronDown className="ml-1 h-3 w-3" />
        </div>
      )}
      <button
        className={cn(
          "border rounded-md px-3 py-1 flex items-center transition-colors text-xs",
          percentage ? "rounded-l-none" : "",
          className
        )}
        onClick={(e) => {
          e.preventDefault()
          onClick()
        }}
      >
        {icon && <span className="mr-1">{icon}</span>}
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