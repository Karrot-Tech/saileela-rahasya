'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const getAdminEmails = () => {
    const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').replace(/['"]/g, '');
    return emails.split(',').map(e => e.trim().toLowerCase()).filter(e => e !== '');
};

export default function AdminModeIndicator() {
    const { isLoaded, isSignedIn, user } = useUser();

    if (!isLoaded || !isSignedIn) return null;

    const adminEmails = getAdminEmails();
    const isAdmin = user?.emailAddresses.some(emailObj =>
        adminEmails.includes(emailObj.emailAddress.toLowerCase())
    );

    if (!isAdmin) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
            <div className="mt-2 mx-4 pointer-events-auto">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 bg-gray-900/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full shadow-2xl border border-white/10 hover:bg-black transition-all group active:scale-95"
                >
                    <div className="w-5 h-5 bg-ochre rounded-full flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase">Open Admin Console</span>
                    <ArrowRight className="w-3 h-3 text-white/50 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
