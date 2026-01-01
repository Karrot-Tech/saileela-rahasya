'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Footprints, Lightbulb, Radio, Music, MessageCircleQuestion, BookA } from 'lucide-react';
import { useInquiry } from '@/context/InquiryContext';

const NAV_ITEMS = [
    { label: 'Leela', href: '/leela', icon: Footprints },
    { label: 'Bodhakatha', href: '/bodhakatha', icon: Lightbulb },
    { label: 'Glossary', href: '/glossary', icon: BookA },
    { label: 'Audio', href: '/audio', icon: Music },
    { label: 'Inquiry', href: '/ask', icon: MessageCircleQuestion },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { unreadCount } = useInquiry();

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-[120] lg:hidden shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center h-16 box-content pb-safe">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href);
                    const isAsk = item.href === '/ask';

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-all select-none active:scale-95 ${isActive ? 'text-ochre' : 'text-gray-400'
                                }`}
                            style={{ touchAction: 'manipulation' }}
                        >
                            {isActive && (
                                <div className="absolute left-1/2 -translate-x-1/2 w-[90%] max-w-[72px] inset-y-1.5 bg-ochre/10 rounded-2xl animate-in fade-in zoom-in duration-300" />
                            )}
                            <div className="relative pointer-events-none z-10">
                                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-sm' : 'scale-100'}`} />
                                {isAsk && unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-bold text-white shadow-md shadow-blue-500/30 animate-in zoom-in duration-300">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-tight pointer-events-none z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
