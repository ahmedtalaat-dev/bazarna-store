// Imports
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ToastDisplay } from '@/components/toast-display'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ToastProvider } from '@/contexts/ToastContext'
import { EcommerceProvider } from '@/contexts/EcommerceContext'

// Google Fonts
const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

// Metadata
export const metadata: Metadata = {
  title: 'Bazarna - Premium Products',
  description: 'Shop premium electronics, computers, and accessories',
  icons: {
    icon: [
      {
        url: '/icon.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <ToastProvider>
          <EcommerceProvider>
            <Header />
            {children}
            <Footer />
            <ToastDisplay />
          </EcommerceProvider>
        </ToastProvider>
        
      </body>
    </html>
  )
}
