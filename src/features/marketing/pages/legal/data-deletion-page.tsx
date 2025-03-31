"use client"

import Link from "next/link"

export default function DataDeletionPage() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Data Deletion Policy</h1>
        <p className="text-gray-400 mb-12">Effective Date: March 10, 2025</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">1. Manual Deletion Requests</h2>
            <p className="text-gray-300 mb-4">
              Clients may request full deletion of stored data. Email <a href="mailto:a@arian.so" className="text-[#ff6363] hover:underline">a@arian.so</a> with subject: &ldquo;Data Deletion Request.&rdquo;
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>We will delete all stored data within 7 business days</li>
              <li>A confirmation email will be sent upon completion</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">2. Automatic Data Expiry</h2>
            <p className="text-gray-300">
              We periodically purge unused or expired campaign data after 90 days of inactivity unless otherwise agreed upon.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">3. API Access Revocation</h2>
            <p className="text-gray-300">
              If a client disconnects their Meta or TikTok ad account, we immediately lose access to data and cease collection.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">4. Contact</h2>
            <p className="text-gray-300">
              To initiate data deletion or revoke access: <a href="mailto:a@arian.so" className="text-[#ff6363] hover:underline">a@arian.so</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
} 