import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GARGATI MINNING | Mineral Resources & Engineering, Abuja',
  description: 'GARGATI MINNING ENGINEERING CONSTRUCTION COMPANY LIMITED — Nigerian solid mineral sourcing, bulk supply, civil engineering and infrastructure construction. CAC RC No.: 9963225.',
  applicationName: 'GARGATI MINNING ENGINEERING CONSTRUCTION COMPANY LIMITED',
  openGraph: {
    title: 'GARGATI MINNING | Mineral Resources & Engineering, Abuja',
    description: 'Nigerian solid mineral sourcing, bulk supply and heavy engineering infrastructure. Based in Lokogoma, F.C.T. Abuja.',
    type: 'website',
    locale: 'en_NG',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0F1E36',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
