// src/app/layout.tsx
import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/lib/theme-provider";
import { GoogleAnalytics } from '@next/third-parties/google'

const kanit = Kanit({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "thai"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ekorsob.com - ระบบฝึกข้อสอบออนไลน์",
    template: "%s | Ekorsob.com"
  },
  description: "ระบบฝึกข้อสอบออนไลน์ TOEIC, ภาค ก., A-Level, นักวิชาการศุลกากร พร้อมเฉลยละเอียดจาก AI ฝึกฟรี 100%",
  keywords: ["ข้อสอบ", "TOEIC", "ภาค ก", "A-Level", "นักวิชาการศุลกากร", "ข้อสอบออนไลน์", "ฝึกข้อสอบ"],
  authors: [{ name: "Ekorsob.com" }],
  creator: "Ekorsob.com",
  publisher: "Ekorsob.com",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    url: '/',
    title: 'Ekorsob.com - ระบบฝึกข้อสอบออนไลน์',
    description: 'ฝึกข้อสอบ TOEIC, ภาค ก., A-Level ฟรี พร้อมเฉลยละเอียดจาก AI',
    siteName: 'Ekorsob.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ekorsob.com',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ekorsob.com - ระบบฝึกข้อสอบออนไลน์',
    description: 'ฝึกข้อสอบ TOEIC, ภาค ก., A-Level ฟรี',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${kanit.className} antialiased`}>
        <Navbar />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  );
}