'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Footprints, Lightbulb, Radio, Music, MessageCircleQuestion, BookA, ShieldCheck } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

const NAV_ITEMS = [
    { label: 'Leela', href: '/leela', icon: Footprints },
    { label: 'Bodhakatha', href: '/bodhakatha', icon: Lightbulb },
    { label: 'Live Stream', href: '/live', icon: Radio },
    { label: 'Bhajan/Audio', href: '/audio', icon: Music },
    { label: 'Spiritual Inquiry', href: '/ask', icon: MessageCircleQuestion },
];

const getAdminEmails = () => {
    const emails = process.env.NEXT_PUBLIC_ADMIN_EMAILS || '';
    return emails.split(',').map(e => e.trim().toLowerCase());
};

export default function Sidebar() {
    const pathname = usePathname();
    const { user } = useUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    const isAdmin = email && getAdminEmails().includes(email.toLowerCase());

    return (
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-40">
            <div className="h-16 flex items-center px-3 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-3">
                    <img
                        src="/logo.jpg"
                        alt="Sai Leela Rahasya"
                        className="h-10 w-auto object-contain"
                    />
                    <h1 className="text-lg font-bold text-ochre tracking-wide leading-tight">Sai Leela Rahasya</h1>
                </Link>
            </div>

            <nav className="flex-1 py-6 space-y-2 px-4 flex flex-col">
                <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-orange-50 text-ochre font-bold'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 space-y-1">
                    <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">More</p>
                    <Link href="/glossary" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-500 hover:text-ochre hover:bg-gray-50 rounded-lg transition-colors">
                        <BookA className="w-4 h-4" />
                        <span>Glossary</span>
                    </Link>

                </div>
            </nav>

            <div className="p-4 text-xs text-center text-gray-400 border-t border-gray-100">
                &copy; {new Date().getFullYear()} Sai Leela Rahasya
            </div>
        </aside>
    );
}
