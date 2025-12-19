'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Footprints, Lightbulb, Radio, Music, MessageCircleQuestion } from 'lucide-react';
import { useInquiry } from '@/context/InquiryContext';

const NAV_ITEMS = [
    { label: 'Leela', href: '/leela', icon: Footprints },
    { label: 'Bodhakatha', href: '/bodhakatha', icon: Lightbulb },
    { label: 'Live', href: '/live', icon: Radio },
    { label: 'Audio', href: '/audio', icon: Music },
    { label: 'Inquiry', href: '/ask', icon: MessageCircleQuestion },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { unreadCount } = useInquiry();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href);
                    const isAsk = item.href === '/ask';

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative ${isActive ? 'text-ochre' : 'text-gray-400'
                                }`}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5" />
                                {isAsk && unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-bold text-white shadow-md shadow-blue-500/30 animate-in zoom-in duration-300">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
