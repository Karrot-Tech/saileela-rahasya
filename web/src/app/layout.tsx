import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/layout/Layout";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";
import UpdateDetector from "@/components/common/UpdateDetector";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saileelarahasya-web.vercel.app'),
  title: {
    default: "Sai Leela Rahasya",
    template: "%s | Sai Leela Rahasya",
  },
  description: "Unveil the secret meanings behind Shirdi Sai Baba's divine plays. Explore the Sai Leela Rahasya through authentic Leelas, Bodhakathas, and curated spiritual guidance from Krishnaji.",
  keywords: ["Sai Baba", "Shirdi Sai Baba", "Sai Leela Rahasya", "Krishnaji", "Spiritual Guidance", "Sai Satcharitra", "Bhajans"],
  authors: [{ name: "Krishnaji" }],
  openGraph: {
    title: "Sai Leela Rahasya",
    description: "Digital study guide for Krishnaji's teachings.",
    url: "https://saileelarahasya-web.vercel.app",
    siteName: "Sai Leela Rahasya",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sai Leela Rahasya",
  },
  formatDetection: {
    telephone: false,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Leela Rahasya",
    description: "Digital study guide for Krishnaji's teachings.",
    images: ["/icon-512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icon-512.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  }
};

export const viewport = {
  themeColor: "#cc7722",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#cc7722',
          colorTextSecondary: '#6b7280',
          borderRadius: '0.75rem',
        },
        elements: {
          formButtonPrimary: 'bg-ochre hover:bg-orange-700 transition-all duration-200 shadow-md py-3 h-12 font-bold text-sm uppercase tracking-wider',
          socialButtonsBlockButton: 'h-12 border-gray-200 hover:bg-gray-50 transition-all font-semibold text-gray-600',
          socialButtonsBlockButtonText: 'font-semibold',
          formFieldInput: 'h-12 border-gray-200 focus:ring-ochre focus:border-ochre',
          card: 'shadow-2xl rounded-3xl border border-gray-100 overflow-hidden',
          headerTitle: 'text-gray-800 font-black tracking-tight text-2xl',
          headerSubtitle: 'text-gray-500 font-medium',
        }
      }}
      localization={{
        signIn: {
          start: {
            title: 'Sign in to Sai Leela Rahasya',
            subtitle: 'Welcome back! Please sign in to continue your spiritual journey.',
          }
        },
        signUp: {
          start: {
            title: 'Create account for Sai Leela Rahasya',
            subtitle: 'Join us to begin your journey of inquiry.',
          }
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <LanguageProvider>
            {children}
            <UpdateDetector />
            <Analytics />
            <SpeedInsights />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
