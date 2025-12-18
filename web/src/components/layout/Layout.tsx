import Header from './Header';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import { AudioProvider } from '@/context/AudioContext';
import MiniPlayer from '@/components/audio/MiniPlayer';
import audioTracks from '@/data/audio_tracks.json';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AudioProvider allTracks={audioTracks}>
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                    <Header />
                    <main className="flex-1 pt-16 md:pt-0 pb-32 md:pb-4 max-w-7xl mx-auto w-full relative">
                        <div className="md:px-4">
                            {children}
                        </div>
                    </main>
                    <MiniPlayer />
                    <BottomNav />
                </div>
            </div>
        </AudioProvider>
    );
}
