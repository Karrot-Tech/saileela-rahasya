'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser, SignInButton, SignOutButton, SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { User, X, BookA, ShieldCheck, ArrowRight, LogOut, Settings, LayoutDashboard, History } from 'lucide-react';

const getAdminEmails = () => {
    const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').replace(/['"]/g, '');
    return emails.split(',').map(e => e.trim().toLowerCase()).filter(e => e !== '');
};

export default function UtilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
    const { openUserProfile } = useClerk();
    const pathname = usePathname();

    const adminEmails = getAdminEmails();
    const isAdmin = user?.emailAddresses.some(emailObj =>
        adminEmails.includes(emailObj.emailAddress.toLowerCase())
    );

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            {/* Avatar Trigger / Custom Account Icon */}
            <div className="flex items-center gap-3">
                <SignedIn>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="hidden md:flex items-center gap-2 bg-gray-900 text-white pl-3 pr-5 py-2 rounded-full shadow-lg border border-white/10 hover:bg-black transition-all group active:scale-95 whitespace-nowrap"
                        >
                            <div className="w-5 h-5 bg-ochre rounded-full flex items-center justify-center flex-none">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest uppercase">Admin Console</span>
                        </Link>
                    )}
                    <button
                        onClick={toggleMenu}
                        className="flex-none transition-transform active:scale-90"
                    >
                        {user?.imageUrl ? (
                            <img
                                src={user.imageUrl}
                                alt={user.fullName || 'User'}
                                className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md object-cover"
                            />
                        ) : (
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-ochre border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs">
                                {user?.firstName?.charAt(0) || 'U'}
                            </div>
                        )}
                    </button>
                </SignedIn>
                <SignedOut>
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full border border-gray-200 bg-white shadow-sm transition-all active:scale-90"
                        aria-label="User Menu"
                    >
                        <User className="w-5 h-5" />
                    </button>
                </SignedOut>
            </div>

            {/* Premium Slide-out Account Panel */}
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-[2px] transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}
            {/* Menu Drawer */}
            <div className={`fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-[110] shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                {/* Header - Aligned with App Header for seamless toggle */}
                <div className="flex justify-between items-center h-16 px-4 md:px-6 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <SignedIn>
                            {user?.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-xl object-cover border border-gray-100 shadow-sm"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-ochre/10 flex items-center justify-center text-ochre border border-ochre/5">
                                    <User className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                            )}
                        </SignedIn>
                        <SignedOut>
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-ochre/10 rounded-xl flex items-center justify-center text-ochre border border-ochre/5">
                                <User className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                        </SignedOut>
                        <div className="flex flex-col">
                            <h2 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-900 leading-none">Om Sai Ram 🙏</h2>
                            <SignedIn>
                                <p className="text-[9px] font-bold text-ochre uppercase tracking-tight mt-1 leading-none">
                                    {user?.firstName || 'Devotee'}
                                </p>
                            </SignedIn>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all active:scale-90"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-5 space-y-4 h-[calc(100%-64px)] flex flex-col no-scrollbar overflow-y-auto pb-24">
                    <SignedIn>
                        {/* Profile display moved to header to save space */}

                        {/* Navigation Actions - Standardized Premium Style */}
                        <nav className="space-y-2 flex-1">
                            {isAdmin && (
                                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3.5 hover:bg-gray-900 rounded-[1.25rem] transition-all group bg-gray-50/50 border border-gray-100/50 hover:border-gray-900">
                                    <div className="flex items-center gap-4 text-gray-700 group-hover:text-white">
                                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-ochre shadow-sm group-hover:bg-ochre group-hover:text-white transition-all flex-none">
                                            <LayoutDashboard className="w-5 h-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="font-black text-xs text-gray-900 tracking-tight leading-none group-hover:text-white transition-colors">Admin Console</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 group-hover:text-white/50">System Management</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}

                            <Link href="/ask" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3.5 hover:bg-ochre/5 rounded-[1.25rem] transition-all group border border-transparent hover:border-ochre/10">
                                <div className="flex items-center gap-4 text-gray-700 group-hover:text-ochre">
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-ochre/10 group-hover:text-ochre transition-all flex-none">
                                        <History className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-xs text-gray-900 tracking-tight leading-none group-hover:text-ochre transition-colors">Guidance History</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 group-hover:text-ochre/70">Personal Inquiry Log</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-ochre transition-transform group-hover:translate-x-1" />
                            </Link>

                            <Link href="/glossary" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-3.5 hover:bg-ochre/5 rounded-[1.25rem] transition-all group border border-transparent hover:border-ochre/10">
                                <div className="flex items-center gap-4 text-gray-700 group-hover:text-ochre">
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-ochre/10 group-hover:text-ochre transition-all flex-none">
                                        <BookA className="w-5 h-5 flex-none" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-xs text-gray-900 tracking-tight leading-none group-hover:text-ochre transition-colors">Exhaustive Glossary</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 group-hover:text-ochre/70">Spiritual Archives</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-ochre transition-transform group-hover:translate-x-1" />
                            </Link>

                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    openUserProfile();
                                }}
                                className="w-full flex items-center justify-between p-3.5 hover:bg-ochre/5 rounded-[1.25rem] transition-all group border border-transparent hover:border-ochre/10"
                            >
                                <div className="flex items-center gap-4 text-gray-700 group-hover:text-ochre">
                                    <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-ochre/10 group-hover:text-ochre transition-all flex-none">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-black text-xs text-gray-900 tracking-tight leading-none group-hover:text-ochre transition-colors">Profile Settings</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1.5 group-hover:text-ochre/70">Account Preferences</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-ochre transition-transform group-hover:translate-x-1" />
                            </button>
                        </nav>

                        {/* Footer Actions */}
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <SignOutButton>
                                <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] transition-all border border-transparent hover:border-red-100 group shadow-sm">
                                    <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
                                    <span>Sign Out Session</span>
                                </button>
                            </SignOutButton>
                        </div>
                    </SignedIn>

                    <SignedOut>
                        <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
                            <div className="w-20 h-20 bg-ochre/5 rounded-full flex items-center justify-center mx-auto text-ochre">
                                <User className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900">Join the Collective</h3>
                                <p className="text-sm text-gray-500 leading-relaxed font-medium">Please sign in to share questions and access personalized spiritual guidance.</p>
                            </div>
                            <div className="pt-4">
                                <SignInButton mode="modal">
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-full py-4 bg-ochre text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gold transition-all shadow-xl shadow-ochre/20 active:scale-95"
                                    >
                                        Identify to Begin
                                    </button>
                                </SignInButton>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <Link href="/glossary" onClick={() => setIsOpen(false)} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                                <BookA className="w-6 h-6 text-gray-400 group-hover:text-ochre transition-colors flex-none" />
                                <div className="text-left">
                                    <p className="font-bold text-sm text-gray-900 tracking-tight group-hover:text-ochre transition-colors">Exhaustive Glossary</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Spiritual Archives</p>
                                </div>
                            </Link>
                        </div>
                    </SignedOut>

                    <div className="text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Sai Leela Rahasya v1.1.44</p>
                    </div>
                </div>
            </div>
        </>
    );
}
