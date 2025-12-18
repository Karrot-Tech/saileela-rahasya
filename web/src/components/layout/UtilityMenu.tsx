'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, X, BookA, ShieldCheck, ArrowRight } from 'lucide-react';
import { useUser, SignInButton, UserButton, SignedIn, SignedOut } from '@clerk/nextjs';

const getAdminEmails = () => {
    const emails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').replace(/['"]/g, '');
    return emails.split(',').map(e => e.trim().toLowerCase()).filter(e => e !== '');
};

export default function UtilityMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoaded, isSignedIn, user } = useUser();
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
            {/* Avatar Trigger / Clerk User Button */}
            <div className="flex items-center gap-4">
                <SignedIn>
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-lg border border-white/10 hover:bg-black transition-all group active:scale-95 whitespace-nowrap"
                        >
                            <div className="w-4 h-4 md:w-5 md:h-5 bg-ochre rounded-full flex items-center justify-center flex-none">
                                <ShieldCheck className="w-2.5 h-2.5 md:w-3 h-3 text-white" />
                            </div>
                            <span className="text-[8px] md:text-[10px] font-black tracking-widest uppercase">Open Admin Console</span>
                            <ArrowRight className="w-2.5 h-2.5 md:w-3 h-3 text-white/50 group-hover:translate-x-1 transition-transform hidden sm:block" />
                        </Link>
                    )}
                    <div className="flex-none">
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
                <SignedOut>
                    <button
                        onClick={toggleMenu}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-full border border-gray-200 bg-white shadow-sm"
                        aria-label="User Menu"
                    >
                        <User className="w-5 h-5" />
                    </button>
                </SignedOut>
            </div>

            {/* Slide-out Panel (Only for Guests to see Login trigger) */}
            <SignedOut>
                {/* Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-50 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                {/* Menu Drawer */}
                <div className={`fixed top-0 right-0 h-full w-80 bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}>
                    <div className="flex justify-between items-center p-4 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-800">Welcome, Guest</h2>
                        <button onClick={() => setIsOpen(false)} className="p-2 text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-4 space-y-6">
                        {/* Primary Action */}
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <SignInButton mode="modal">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-2 bg-ochre text-white rounded-md font-bold hover:bg-orange-700 transition"
                                >
                                    Sign In / Register
                                </button>
                            </SignInButton>
                        </div>

                        {/* Secondary Links */}
                        <nav className="space-y-2 md:hidden">
                            <Link href="/glossary" onClick={() => setIsOpen(false)} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md text-gray-700">
                                <BookA className="w-5 h-5 text-gray-400" />
                                <span>Glossary</span>
                            </Link>
                        </nav>
                    </div>
                </div>
            </SignedOut>
        </>
    );
}
