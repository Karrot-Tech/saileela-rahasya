
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Footprints,
    Lightbulb,
    Book,
    Ticket
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { getOpenTicketsCount } from '@/actions/tickets';

const ADMIN_NAV_ITEMS = [
    { label: 'Dash', href: '/admin', icon: LayoutDashboard },
    { label: 'Leela', href: '/admin/leela', icon: Footprints },
    { label: 'Bodha', href: '/admin/bodhakatha', icon: Lightbulb },
    { label: 'Glossary', href: '/admin/glossary', icon: Book },
    { label: 'Inquiry', href: '/admin/tickets', icon: Ticket, isTickets: true },
];

export default function AdminBottomNav() {
    const pathname = usePathname();
    const [openCount, setOpenCount] = useState(0);

    useEffect(() => {
        getOpenTicketsCount().then(setOpenCount);
        const interval = setInterval(() => {
            getOpenTicketsCount().then(setOpenCount);
        }, 120000);
        return () => clearInterval(interval);
    }, []);

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10 z-[120] lg:hidden backdrop-blur-md bg-gray-900/90">
            <div className="flex justify-around items-center h-16 pb-safe">
                {ADMIN_NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.href === '/admin'
                        ? pathname === '/admin'
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch={false}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 relative transition-colors select-none ${isActive ? 'text-ochre' : 'text-gray-500'
                                }`}
                            style={{ touchAction: 'manipulation' }}
                        >
                            <div className="relative pointer-events-none">
                                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'scale-100'}`} />
                                {item.isTickets && openCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[7px] font-black text-white shadow-lg ring-1 ring-gray-900 animate-in zoom-in duration-300">
                                        {openCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-tighter pointer-events-none">{item.label}</span>
                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 bg-ochre rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
