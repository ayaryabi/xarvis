import Link from "next/link"

export default function Privacy() {
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
          
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-gray-400 mb-12">Effective Date: March 10, 2025</p>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">1. Introduction</h2>
              <p className="text-gray-300">
                Esmaeilbeig Consulting UG (&ldquo;we,&rdquo; &ldquo;our,&rdquo; &ldquo;us&rdquo;) provides ad management and automation services via platforms such as Meta&apos;s Marketing API and TikTok&apos;s Marketing API. This Privacy Policy explains how we collect, store, use, and protect data from businesses using our services.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">2. Information We Access</h2>
              <p className="text-gray-300 mb-4">
                We access business-related data via Meta and TikTok APIs, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Campaign details (budgets, performance metrics, ad creatives, etc.)</li>
                <li>Ad account settings</li>
                <li>Pixel and event tracking configurations</li>
                <li>Business Manager assets</li>
                <li>Other data required for campaign management and reporting</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We <strong>do not access personal user-level data</strong>. Only authorized business data is accessed.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">3. Data Storage and Usage</h2>
              <p className="text-gray-300 mb-4">
                We store select performance-related data in our database (e.g., Supabase) to enable:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
                <li>Scheduled Slack notifications</li>
                <li>Performance monitoring</li>
                <li>Reporting (e.g., Google Sheets integration)</li>
                <li>Alert generation (e.g., ROAS drops, CTR alerts)</li>
              </ul>
              
              <p className="text-gray-300 mb-4">
                Stored data may include:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Ad account ID</li>
                <li>Campaign, ad set, and ad IDs</li>
                <li>Campaign names</li>
                <li>Spend, ROAS, CTR, CPC, conversions</li>
                <li>Custom metrics and user-defined insights</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                All data is encrypted and stored securely. Users can request deletion at any time.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">4. Data Retention</h2>
              <p className="text-gray-300 mb-4">
                We retain data only as long as necessary to provide services. Users can:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Request deletion</li>
                <li>Disconnect ad accounts, which terminates data collection</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">5. Data Sharing</h2>
              <p className="text-gray-300">
                We <strong>do not sell or share</strong> client data with any third parties. Data is only used to operate and optimize your ad campaigns.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">6. Cookies and Tracking</h2>
              <p className="text-gray-300">
                We do not use cookies or trackers on our public website (arian.so).
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">7. Security Measures</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>All API tokens are securely stored</li>
                <li>Data is encrypted at rest and in transit</li>
                <li>Access is limited to authorized personnel only</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">8. User Rights</h2>
              <p className="text-gray-300 mb-4">
                Users may request:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Access to their stored data</li>
                <li>Correction of inaccurate data</li>
                <li>Complete deletion of all stored data</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                Email: <a href="mailto:a@arian.so" className="text-[#ff6363] hover:underline">a@arian.so</a> with subject: &ldquo;Data Request&rdquo;
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold mb-4 text-[#ff6363]">9. Contact</h2>
              <p className="text-gray-300">
                Questions or concerns? Reach us at <a href="mailto:a@arian.so" className="text-[#ff6363] hover:underline">a@arian.so</a>
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