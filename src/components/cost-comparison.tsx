"use client"

import type React from "react"
import { InfoIcon } from "lucide-react"

export function CostComparisonSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="cost-comparison">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-1/3 h-1/3 bg-gradient-to-l from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            The most intelligent media buyer at a
            <br />
            <span className="text-[#ff6363]">fraction of the cost</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traditional Approach */}
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold">Traditional Approach</h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Media Buyer</div>
                      <div className="text-sm text-gray-400">Campaign Management</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">$8,000/mo</div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Creative Strategist</div>
                      <div className="text-sm text-gray-400">Ad Design & Copy</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">$6,000/mo</div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                        <line x1="6" y1="6" x2="6" y2="6"></line>
                        <line x1="6" y1="18" x2="6" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Analytics Tools</div>
                      <div className="text-sm text-gray-400">Performance Monitoring</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">$1,200/mo</div>
                </div>

                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Tracking Tools</div>
                      <div className="text-sm text-gray-400">Attribution & Reporting</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold">$800/mo</div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="font-bold text-xl">Total Cost</div>
                  <div className="text-2xl font-bold">$16,000/mo</div>
                </div>
              </div>
            </div>

            {/* XARVIS Approach */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-2xl blur opacity-30"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold">XARVIS and His Crew</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#ff6363]/10 border border-[#ff6363]/30 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff6363]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 7h-9"></path>
                          <path d="M14 17H5"></path>
                          <circle cx="17" cy="17" r="3"></circle>
                          <circle cx="7" cy="7" r="3"></circle>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Agent Orion</div>
                        <div className="text-sm text-gray-400">Campaign Management & Optimization</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#ff6363]/10 border border-[#ff6363]/30 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff6363]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Agent Echo</div>
                        <div className="text-sm text-gray-400">Creative Generation & Testing</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#ff6363]/10 border border-[#ff6363]/30 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff6363]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                          <line x1="12" y1="22.08" x2="12" y2="12"></line>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Agent Zero</div>
                        <div className="text-sm text-gray-400">Analytics & Reporting</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-[#ff6363]/10 border border-[#ff6363]/30 flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ff6363]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">Agent Nexus</div>
                        <div className="text-sm text-gray-400">Cross-Platform Integration</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="font-bold text-xl">Total Cost</div>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-bold text-[#ff6363]">$2,000/mo</div>
                      <div className="ml-2 bg-[#ff6363]/10 text-[#ff6363] text-xs py-1 px-2 rounded">-88%</div>
                      <div className="group relative ml-2">
                        <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl text-xs text-left opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                          <p className="text-gray-200">This is a comparison of traditional agency costs vs. XARVIS capability. Actual pricing varies based on client needs.</p>
                          <a href="#pricing" className="text-[#ff6363] hover:underline block mt-1">View our pricing</a>
                          <div className="absolute top-full right-4 w-0 h-0 border-8 border-transparent border-t-black/90"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <div className="relative inline-block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-xl blur opacity-30"></div>
              <button className="relative bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white px-8 py-4 rounded-xl text-lg shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20 font-bold">
                Hire XARVIS and His Crew
                <span className="ml-2">→</span>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">Based on managing $200K monthly ad spend across multiple platforms</p>
          </div>
        </div>
      </div>
    </section>
  )
} 