'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Footprints, Lightbulb, Radio, Music, MessageCircleQuestion, BookA } from 'lucide-react';
import { useInquiry } from '@/context/InquiryContext';

const NAV_ITEMS = [
    { label: 'Leela', href: '/leela', icon: Footprints },
    { label: 'Bodhakatha', href: '/bodhakatha', icon: Lightbulb },
    { label: 'Live Stream', href: '/live', icon: Radio },
    { label: 'Bhajan/Audio', href: '/audio', icon: Music },
    { label: 'Spiritual Inquiry', href: '/ask', icon: MessageCircleQuestion },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { unreadCount } = useInquiry();

    return (
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-40">
            <div className="h-16 flex items-center px-3 border-b border-gray-100">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/saileela-logo.png"
                        alt="Saileela Rahasya"
                        width={40}
                        height={40}
                        className="h-10 w-auto object-contain"
                    />
                    <h1 className="text-lg font-bold text-ochre tracking-wide leading-tight">Saileela Rahasya</h1>
                </Link>
            </div>

            <nav className="flex-1 py-6 space-y-2 px-4 flex flex-col">
                <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || pathname.startsWith(item.href);
                        const isAsk = item.href === '/ask';

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-orange-50 text-ochre font-bold'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </div>
                                {isAsk && unreadCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-lg shadow-blue-500/30 animate-in zoom-in duration-300">
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col">
                    <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3">Resources</p>
                    <Link
                        href="/glossary"
                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition-all group mx-1 ${pathname === '/glossary'
                            ? 'bg-ochre/5 border border-ochre/10'
                            : 'hover:bg-gray-50 border border-transparent'
                            }`}
                    >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all flex-none ${pathname === '/glossary'
                            ? 'bg-ochre text-white shadow-lg shadow-ochre/20'
                            : 'bg-gray-50 text-gray-400 group-hover:bg-ochre/10 group-hover:text-ochre shadow-inner'
                            }`}>
                            <BookA className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0">
                            <p className={`font-black text-xs tracking-tight leading-none truncate ${pathname === '/glossary' ? 'text-ochre' : 'text-gray-900'
                                }`}>Exhaustive Glossary</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 group-hover:text-ochre/70 truncate">Spiritual Archives</p>
                        </div>
                    </Link>
                </div>
            </nav>

            <div className="p-5 text-center border-t border-gray-50 bg-gray-50/30">
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Saileela Rahasya v1.2.1</p>
                <p className="text-[10px] text-gray-600 font-medium font-serif italic">&copy; {new Date().getFullYear()} Saileela Rahasya</p>
            </div>
        </aside>
    );
}
