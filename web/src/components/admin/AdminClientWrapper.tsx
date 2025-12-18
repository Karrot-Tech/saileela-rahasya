
'use client';

import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import { Menu, ShieldCheck, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminClientWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Dedicated Admin Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Admin Content Area */}
            <div className="flex-1 flex flex-col lg:ml-72 min-h-screen">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-40 lg:hidden shadow-sm backdrop-blur-md bg-white/80">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 text-gray-400 hover:text-ochre transition-colors active:scale-90"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-ochre rounded-xl flex items-center justify-center shadow-lg shadow-ochre/20">
                                <ShieldCheck className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-gray-900 font-black tracking-tight leading-none text-[10px]">SAILEELA RAHASYA</h1>
                                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Admin Console</p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/"
                        className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full shadow-lg border border-white/10 hover:bg-black transition-all group active:scale-95 whitespace-nowrap"
                    >
                        <div className="w-4 h-4 bg-white/10 rounded-full flex items-center justify-center flex-none group-hover:bg-ochre transition-colors">
                            <Home className="w-2.5 h-2.5 text-white" />
                        </div>
                        <span className="text-[8px] font-black tracking-widest uppercase">Visit Site</span>
                        <ArrowRight className="w-2.5 h-2.5 text-white/50 group-hover:translate-x-1 transition-transform hidden xs:block" />
                    </Link>
                </header>

                <main className="flex-1 p-4 md:p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="p-8 text-center text-[10px] md:text-xs text-gray-400 font-medium tracking-tight">
                    &copy; {new Date().getFullYear()} Sai Leela Rahasya Admin Portal • Strictly Authorized Personnel Only
                </footer>
            </div>
        </div>
    );
}
