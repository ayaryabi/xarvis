"use client"

import Link from "next/link"
import { Navbar } from "@/components/pages/landing/navbar"
import { Footer } from "@/components/pages/landing/footer"

export default function Terms() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-gray-400 mb-12">Effective Date: March 10, 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">1. Agreement to Terms</h2>
              <p className="text-gray-300">
                By using our services, you agree to these Terms. Specific service terms may be outlined in additional contracts.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">2. Scope of Services</h2>
              <p className="text-gray-300 mb-4">
                We provide:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Ad campaign creation, management, and optimization</li>
                <li>Automated budget adjustments and performance tracking</li>
                <li>Platform integrations (e.g., Slack, Google Sheets)</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">3. Client Responsibilities</h2>
              <p className="text-gray-300 mb-4">
                Clients must:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Provide valid Meta and/or TikTok ad accounts with required permissions</li>
                <li>Comply with Meta and TikTok&apos;s advertising policies</li>
                <li>Understand we are not liable for platform-level changes, ad rejections, or bans</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">4. Limitations of Liability</h2>
              <p className="text-gray-300 mb-4">
                We are not liable for:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Ad performance outcomes</li>
                <li>API access restrictions or changes</li>
                <li>Technical issues from third-party platforms</li>
                <li>Client misconfigurations</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">5. Fees</h2>
              <p className="text-gray-300">
                Fees are determined via contract or based on usage tier. Any platform ad spend is separate and paid by the client.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">6. Termination</h2>
              <p className="text-gray-300">
                We may suspend or terminate access if there is abuse, violation of terms, or platform policy breaches.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">7. Contact</h2>
              <p className="text-gray-300">
                For inquiries: <a href="mailto:a@arian.so" className="text-[#ff6363] hover:underline">a@arian.so</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
} 