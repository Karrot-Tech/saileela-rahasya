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
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-[120] md:hidden">
            <div className="flex justify-around items-center h-16 pb-safe">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href);
                    const isAsk = item.href === '/ask';

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-all select-none active:bg-gray-100/50 ${isActive ? 'text-ochre' : 'text-gray-400'
                                }`}
                            style={{ touchAction: 'manipulation' }}
                        >
                            {isActive && (
                                <div className="absolute inset-x-2 inset-y-1 bg-ochre/5 rounded-xl animate-in fade-in zoom-in duration-300" />
                            )}
                            <div className="relative pointer-events-none z-10">
                                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-sm' : 'scale-100'}`} />
                                {isAsk && unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-bold text-white shadow-md shadow-blue-500/30 animate-in zoom-in duration-300">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tighter pointer-events-none z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
