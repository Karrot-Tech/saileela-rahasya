'use client';
import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { usePathname } from 'next/navigation';
import MiniPlayer from '@/components/audio/MiniPlayer';


export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300">
                <Header />
                <main className="flex-1 pt-16 lg:pt-0 pb-32 lg:pb-4 max-w-7xl mx-auto w-full relative">
                    <div className="lg:px-4 page-fade-in" key={pathname}>
                        {children}
                    </div>
                </main>
                <MiniPlayer />
                <BottomNav />
            </div>
        </div>
    );
}
