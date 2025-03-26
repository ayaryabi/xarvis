import { MarketingShell } from '@/components/3-layout/shells/marketing-shell'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MarketingShell>
      {children}
    </MarketingShell>
  )
} 