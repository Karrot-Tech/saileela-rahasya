'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from './AdminSidebar';
import { Menu, ShieldCheck, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AdminBottomNav from './AdminBottomNav';

export default function AdminClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Dedicated Admin Sidebar (Desktop) */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Admin Content Area */}
            <div className="flex-1 flex flex-col lg:ml-72 min-h-screen pb-24 lg:pb-0">
                {/* Unified Admin Header */}
                <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-40 w-full">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-ochre rounded-2xl flex items-center justify-center shadow-xl shadow-ochre/20 flex-none group hover:rotate-6 transition-transform">
                            <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h1 className="text-gray-900 font-extrabold tracking-tight leading-none text-xs lg:text-sm truncate uppercase font-serif italic">SAILEELA RAHASYA</h1>
                            <div className="flex items-center gap-2 mt-1.5 lg:mt-2">
                                <span className="text-[7px] lg:text-[9px] text-ochre font-black uppercase tracking-[0.2em] bg-ochre/5 px-2 py-0.5 rounded-full border border-ochre/10 truncate">Admin Console</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="https://saileelarahasya.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            prefetch={false}
                            className="flex items-center gap-3 bg-gray-900 text-white px-4 lg:px-6 py-2.5 lg:py-3 rounded-2xl shadow-xl shadow-gray-200 border border-white/10 hover:bg-black transition-all group active:scale-95 whitespace-nowrap"
                        >
                            <Home className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-white/70 group-hover:text-ochre transition-colors" />
                            <span className="text-[8px] lg:text-[10px] font-black tracking-[0.2em] uppercase">Visit Site</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-6 md:py-10 lg:py-16 px-6 md:px-12 min-w-0 overflow-x-hidden">
                    <div className="max-w-5xl mx-auto w-full page-fade-in" key={pathname}>
                        {children}
                    </div>
                </main>

                <AdminBottomNav />

                <footer className="p-8 text-center text-[10px] md:text-xs text-gray-400 font-medium tracking-tight">
                    &copy; {new Date().getFullYear()} Saileela Rahasya Admin Portal • Strictly Authorized Personnel Only
                </footer>
            </div>
        </div>
    );
}
