'use client';

import { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function UpdateDetector() {
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const currentVersionRef = useRef<string | null>(null);

    useEffect(() => {
        // Only run in production
        if (process.env.NODE_ENV !== 'production') return;

        // Function to check for updates
        const checkForUpdate = async () => {
            try {
                const res = await fetch(`/version.json?t=${Date.now()}`, {
                    cache: 'no-store'
                });
                const data = await res.json();
                const remoteVersion = data.version + '-' + data.buildTime;

                if (currentVersionRef.current && remoteVersion !== currentVersionRef.current) {
                    setUpdateAvailable(true);
                } else if (!currentVersionRef.current) {
                    // First load initialization
                    currentVersionRef.current = remoteVersion;
                }
            } catch (e) {
                // Ignore fetch errors
            }
        };

        // Initial check
        checkForUpdate();

        // Check for updates every 10 minutes
        const interval = setInterval(checkForUpdate, 10 * 60 * 1000);

        // Also check when the tab becomes focused
        window.addEventListener('focus', checkForUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', checkForUpdate);
        };
    }, []);

    if (!updateAvailable) return null;

    return (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom duration-500">
            <button
                onClick={() => window.location.reload()}
                className="bg-ochre text-white px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 border border-white/20 hover:bg-orange-700 transition-all transform active:scale-95"
            >
                <div className="bg-white/20 p-1 rounded-full animate-spin-slow">
                    <RefreshCw className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm">New Update Available! Tap to refresh</span>
            </button>
        </div>
    );
}
