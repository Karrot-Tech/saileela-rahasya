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
                            className="hidden md:flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg border border-white/10 hover:bg-black transition-all group active:scale-95 whitespace-nowrap"
                        >
                            <div className="w-5 h-5 bg-ochre rounded-full flex items-center justify-center flex-none">
                                <ShieldCheck className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] font-black tracking-widest uppercase">Admin Console</span>
                            <ArrowRight className="w-3 h-3 text-white/50 group-hover:translate-x-1 transition-transform" />
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
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-ochre/10 rounded-xl flex items-center justify-center text-ochre">
                            <User className="w-5 h-5" />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Account</h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-8 h-[calc(100%-80px)] flex flex-col no-scrollbar overflow-y-auto pb-32">
                    <SignedIn>
                        {/* User Profile Summary */}
                        <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                            {user?.imageUrl ? (
                                <img src={user.imageUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-sm" alt="Profile" />
                            ) : (
                                <div className="w-16 h-16 rounded-2xl bg-ochre flex items-center justify-center text-white text-2xl font-black">{user?.firstName?.charAt(0)}</div>
                            )}
                            <div className="min-w-0">
                                <p className="font-black text-gray-900 text-lg leading-tight truncate">{user?.fullName}</p>
                                <p className="text-xs font-bold text-gray-400 truncate mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>

                        {/* Navigation Actions */}
                        <nav className="space-y-2 flex-1">
                            <Link href="/ask" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 hover:bg-ochre/5 rounded-2xl transition-all group border border-transparent hover:border-ochre/10">
                                <div className="flex items-center gap-4 text-gray-700 group-hover:text-ochre">
                                    <History className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-tight text-gray-500">My Guidance History</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-ochre transition-transform group-hover:translate-x-1" />
                            </Link>
                            {isAdmin && (
                                <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 hover:bg-gray-900 rounded-2xl transition-all group bg-gray-50 border border-gray-100">
                                    <div className="flex items-center gap-4 text-gray-700 group-hover:text-white">
                                        <LayoutDashboard className="w-5 h-5 text-ochre" />
                                        <span className="font-bold text-sm tracking-tight">Admin Console</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                            <Link href="/glossary" onClick={() => setIsOpen(false)} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group">
                                <div className="flex items-center gap-4 text-gray-500">
                                    <BookA className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-tight">Archives / Glossary</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300" />
                            </Link>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    openUserProfile();
                                }}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all group"
                            >
                                <div className="flex items-center gap-4 text-gray-500">
                                    <Settings className="w-5 h-5" />
                                    <span className="font-bold text-sm tracking-tight">Edit Profile</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-300" />
                            </button>
                        </nav>

                        {/* Footer Actions */}
                        <div className="pt-6 border-t border-gray-100 space-y-3">
                            <SignOutButton>
                                <button className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-transparent hover:border-red-100 group">
                                    <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
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
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-ochre group-hover:bg-ochre/10 transition-colors">
                                    <BookA className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-gray-900 tracking-tight">Exhaustive Glossary</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spiritual Archives</p>
                                </div>
                            </Link>
                        </div>
                    </SignedOut>

                    <div className="text-center">
                        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">Sai Leela Rahasya v1.1.26</p>
                    </div>
                </div>
            </div>
        </>
    );
}
