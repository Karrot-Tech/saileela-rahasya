import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "@/components/layout/Layout";
import { LanguageProvider } from "@/context/LanguageContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Sai Leela Rahasya",
    template: "%s | Sai Leela Rahasya",
  },
  description: "Digital study guide for Krishnaji's teachings. Explore the secret plays of Sai Baba through Leelas, Bodhakathas, and spiritual guidance.",
  keywords: ["Sai Baba", "Shirdi Sai Baba", "Sai Leela Rahasya", "Krishnaji", "Spiritual Guidance", "Sai Satcharitra", "Bhajans"],
  authors: [{ name: "Krishnaji" }],
  openGraph: {
    title: "Sai Leela Rahasya",
    description: "Digital study guide for Krishnaji's teachings.",
    url: "https://saibisa-103.firebaseapp.com", // Assuming this is the canonical URL or update later
    siteName: "Sai Leela Rahasya",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sai Leela Rahasya",
    description: "Digital study guide for Krishnaji's teachings.",
    images: ["/icon.png"],
  },
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
        },
        elements: {
          formButtonPrimary: 'bg-ochre hover:bg-orange-700 transition-all duration-200 shadow-md',
          card: 'shadow-2xl rounded-3xl border border-gray-100 overflow-hidden',
          headerTitle: 'text-gray-800 font-bold',
          headerSubtitle: 'text-gray-500',
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
            <Layout>
              {children}
            </Layout>
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
