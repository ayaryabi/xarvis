import { MarketingNavbar } from '@/components/layout/navigation/marketing-navbar'
import { MarketingFooter } from '@/components/layout/footer/marketing-footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </main>
  )
} 