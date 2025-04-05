import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import QueryClientProvider from '@/lib/react-query/provider'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Xarvis',
  description: 'Your AI-powered assistant',
  icons: {
    icon: '/xarvis_logo_2.png',
    apple: '/xarvis_logo_2.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.variable} antialiased`}>
        <QueryClientProvider>
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
