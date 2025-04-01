'use client'; // Keep client-side for potential future interactions

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
// Keep the old Button import temporarily if needed for other elements, or remove if unused.
// import { Button } from "@/components/old/button"; 
import { CheckoutButton } from './CheckoutButton'; // Import the functional button

// Define the component
export function PricingTable() {
  // Hardcoded Price ID for now
  const priceId = "price_1R91TY2N81TVNUGdwX6IsTDk";

  return (
    <section className="py-20 relative overflow-hidden" id="pricing">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-1/3 h-1/3 bg-gradient-to-r from-[#ff6363]/20 to-transparent rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Exclusive beta pricing available now</p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-2xl blur opacity-30"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
              <div className="absolute -top-5 right-8 bg-[#ff6363] text-white px-4 py-1 rounded-full text-sm font-bold">
                BETA OFFER
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">XARVIS PRO</h3>
                <div className="flex items-center justify-center">
                  <div className="text-4xl font-bold">$250</div>
                  <div className="text-gray-400 ml-1">/month</div>
                </div>
                <div className="text-[#ff6363] text-sm mt-1">Limited beta offer</div>
              </div>

              <div className="space-y-4 mb-8">
                {/* Feature list remains the same */}
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#ff6363]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-[#ff6363]" />
                  </div>
                  <div>
                    <span className="text-gray-200 font-medium">Agent Orion</span>
                    <div className="text-gray-400 text-sm">Campaign Management & Optimization</div>
                  </div>
                </div>
                {/* ... other features ... */}
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#ff6363]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-[#ff6363]" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-gray-300 font-medium">Agent Apollo</span>
                      <span className="ml-2 text-xs bg-[#ff6363]/10 text-[#ff6363]/70 px-2 py-0.5 rounded-full">Coming Soon</span>
                    </div>
                    <div className="text-gray-400 text-sm">Creative Generation & Testing</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#ff6363]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-[#ff6363]" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-gray-300 font-medium">Agent Cipher</span>
                      <span className="ml-2 text-xs bg-[#ff6363]/10 text-[#ff6363]/70 px-2 py-0.5 rounded-full">Coming Soon</span>
                    </div>
                    <div className="text-gray-400 text-sm">Analytics & Reporting</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#ff6363]/20 flex-shrink-0 flex items-center justify-center mr-3 mt-0.5">
                    <Check className="h-3.5 w-3.5 text-[#ff6363]" />
                  </div>
                  <div>
                    <div className="flex items-center">
                      <span className="text-gray-300 font-medium">Agent Nexus</span>
                      <span className="ml-2 text-xs bg-[#ff6363]/10 text-[#ff6363]/70 px-2 py-0.5 rounded-full">Coming Soon</span>
                    </div>
                    <div className="text-gray-400 text-sm">Cross-Platform Integration</div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 my-6 pt-6">
                  <p className="text-gray-200 font-medium mb-3">During Beta:</p>
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 rounded-full bg-[#ff6363]/20 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3 text-[#ff6363]" />
                    </div>
                    <span className="text-gray-300">Unlimited campaigns</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="h-5 w-5 rounded-full bg-[#ff6363]/20 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3 text-[#ff6363]" />
                    </div>
                    <span className="text-gray-300">Unlimited ad spend</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-5 w-5 rounded-full bg-[#ff6363]/20 flex items-center justify-center mr-3">
                      <Check className="h-3 w-3 text-[#ff6363]" />
                    </div>
                    <span className="text-gray-300">Priority support</span>
                  </div>
                </div>
                
                <div className="bg-[#ff6363]/10 rounded-xl p-4 text-sm">
                  <p className="text-[#ff6363] font-medium mb-1">Exclusive Beta Offer:</p>
                  <p className="text-gray-300">Flat $250/month pricing regardless of ad spend during our beta phase. Lock in this rate by joining now!</p>
                </div>
              </div>

              {/* Replace the old Button with CheckoutButton */}
              <CheckoutButton 
                priceId={priceId}
                className="bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white rounded-xl h-auto shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20"
              >
                Hire XARVIS
                <ChevronRight className="ml-2 h-5 w-5" />
              </CheckoutButton>

              <div className="text-center text-sm text-gray-400 mt-4">Try XARVIS for free for 14 days</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
