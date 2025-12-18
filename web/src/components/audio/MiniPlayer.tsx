'use client';

import { useAudio } from '@/context/AudioContext';
import { Play, Pause, SkipForward, SkipBack, Music, X, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function MiniPlayer() {
    const { currentTrack, isPlaying, togglePlay, playNext, playPrev, closePlayer, progress, isLoading } = useAudio();
    // We can choose to hide/show based on path, but typically it shows everywhere 
    // EXCEPT maybe the full player page if we had one.
    // For now, let's keep it visible always if a track is selected.

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] md:bottom-0 left-0 right-0 md:left-64 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-gray-100 cursor-pointer">
                <div
                    className="h-full bg-ochre transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex items-center justify-between px-6 py-3">
                {/* Track Info */}
                <div className="flex items-center space-x-3 overflow-hidden flex-1 mr-4">
                    <div className="w-10 h-10 bg-ochre/10 rounded flex items-center justify-center flex-shrink-0 text-ochre">
                        <Music className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-800 text-sm truncate">{currentTrack.title}</span>
                        <span className="text-xs text-gray-500 truncate">{currentTrack.singer}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                    <button
                        onClick={playPrev}
                        className="p-2 text-gray-400 hover:text-gray-600 hidden sm:block"
                    >
                        <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-2 bg-ochre text-white rounded-full hover:bg-orange-700 transition shadow-sm"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : isPlaying ? (
                            <Pause className="w-5 h-5" />
                        ) : (
                            <Play className="w-5 h-5 ml-0.5" />
                        )}
                    </button>

                    <button
                        onClick={playNext}
                        className="p-2 text-gray-400 hover:text-gray-600 hidden sm:block"
                    >
                        <SkipForward className="w-5 h-5" />
                    </button>

                    <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />

                    <button
                        onClick={closePlayer}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                        title="Close Player"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
