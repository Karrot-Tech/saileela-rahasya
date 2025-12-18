
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Footprints,
    Lightbulb,
    Book,
    Ticket,
    Home,
    ChevronRight,
    ShieldCheck,
    X
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const ADMIN_NAV = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Leela Stories', href: '/admin/leela', icon: Footprints },
    { label: 'Bodhakatha', href: '/admin/bodhakatha', icon: Lightbulb },
    { label: 'Glossary', href: '/admin/glossary', icon: Book },
    { label: 'Seeker Inquiries', href: '/admin/tickets', icon: Ticket },
];

export default function AdminSidebar({
    isOpen,
    onClose
}: {
    isOpen?: boolean;
    onClose?: () => void;
}) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed left-0 top-0 bottom-0 w-72 bg-gray-900 text-gray-300 z-[70] border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Admin Brand */}
                <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-10">
                    <Link href="/admin" className="flex items-center gap-3 group" onClick={onClose}>
                        <div className="w-10 h-10 bg-ochre rounded-xl flex items-center justify-center shadow-lg shadow-ochre/20 group-hover:rotate-12 transition-transform duration-300">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-white font-black tracking-tight leading-none text-xs">SAILEELA RAHASYA</h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Admin Console</p>
                        </div>
                    </Link>

                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-8 custom-scrollbar">
                    <div>
                        <p className="px-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Management</p>
                        <div className="space-y-1">
                            {ADMIN_NAV.map((item) => {
                                const Icon = item.icon;
                                // Check if exact match or if it's a subpage (except for dashboard base)
                                const isActive = item.href === '/admin'
                                    ? pathname === '/admin'
                                    : pathname.startsWith(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                                            ? 'bg-ochre text-white shadow-lg shadow-ochre/20'
                                            : 'hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-ochre'} transition-colors`} />
                                            <span className="font-semibold text-sm">{item.label}</span>
                                        </div>
                                        {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                </nav>

                {/* Footer / User Profile */}
                <div className="p-4 border-t border-white/5 bg-gray-900/80 backdrop-blur-md">
                    <div className="bg-white/5 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserButton
                                afterSignOutUrl="/"
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: 'w-10 h-10 rounded-xl'
                                    }
                                }}
                            />
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-white truncate">Administrator</p>
                                <p className="text-[10px] text-gray-500 truncate">Live Session</p>
                            </div>
                        </div>
                        <Link
                            href="/"
                            className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                            title="Return to App"
                            onClick={onClose}
                        >
                            <Home className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}
