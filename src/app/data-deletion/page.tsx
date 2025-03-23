import Link from "next/link"

export default function DataDeletion() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <Link href="/" className="text-[#ff6363] hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Home
            </Link>
          </div>
          
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
          
          <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© 2025 XARVIS. All rights reserved.</p>
            <div className="flex justify-center gap-4 mt-4">
              <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white">Terms of Service</Link>
              <Link href="/data-deletion" className="hover:text-white">Data Deletion</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 