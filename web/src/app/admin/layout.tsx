import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { LanguageProvider } from "@/context/LanguageContext";
import { Providers } from "@/components/common/Providers";
import "../globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClientWrapper from '@/components/admin/AdminClientWrapper';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Admin Console | Saileela Rahasya",
    description: "Administrative access only.",
    robots: {
        index: false,
        follow: false,
    }
};

export const viewport = {
    themeColor: "#111827", // Darker theme for admin
    width: "device-width",
    initialScale: 1,
};

export default async function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Server-side security check
    // Note: Middleware also protects this, but double safety is good.
    const authorized = await isAdmin();
    if (!authorized) {
        redirect('/');
    }

    return (
        <ClerkProvider
            appearance={{
                variables: {
                    colorPrimary: '#cc7722',
                    colorTextSecondary: '#6b7280',
                    borderRadius: '0.75rem',
                },
            }}
        >
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
                >
                    <LanguageProvider>
                        <Providers>
                            <AdminClientWrapper>
                                {children}
                            </AdminClientWrapper>
                        </Providers>
                    </LanguageProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
