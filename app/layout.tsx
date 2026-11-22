import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { COMPANY } from "@/lib/company"
import "./globals.css"

export const metadata: Metadata = {
  title: `${COMPANY.legalName} | Solid Minerals & Heavy Engineering, Abuja`,
  description:
    "Official corporate portal and B2B procurement desk for GARGATI MINNING ENGINEERING CONSTRUCTION COMPANY LIMITED (RC No.: 9963225). Certified solid minerals (Lithium, Gold, Tin, Coltan, Lead/Zinc, Iron Ore, Limestone, Aggregates) & civil engineering from Lokogoma, F.C.T., Abuja, Nigeria.",
  keywords: [
    "GARGATI MINNING ENGINEERING CONSTRUCTION COMPANY LIMITED",
    "RC 9963225",
    "Solid Minerals Nigeria",
    "Lithium Ore Spodumene Nigeria",
    "Tin Ore Cassiterite Jos",
    "Columbite Tantalite Coltan Nigeria",
    "Civil Engineering Abuja",
    "Lokogoma Construction Company",
    "Bulk Mineral Procurement Nigeria",
  ],
  applicationName: COMPANY.legalName,
  openGraph: {
    title: `${COMPANY.legalName} | Mineral Resources & Heavy Engineering`,
    description:
      "Assay-certified Nigerian solid mineral sourcing, bulk tonnage supply, civil engineering, and heavy haulage from F.C.T. Abuja to global markets. RC No.: 9963225.",
    type: "website",
    locale: "en_NG",
  },
  twitter: {
    card: "summary_large_image",
    title: `${COMPANY.legalName} (${COMPANY.rcNumber})`,
    description:
      "Precision solid mineral extraction, bulk procurement & heavy civil engineering infrastructure from Abuja, Nigeria.",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#0F1E36",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-[#1E293B] antialiased selection:bg-[#F59E0B]/25 selection:text-[#0F1E36]">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
