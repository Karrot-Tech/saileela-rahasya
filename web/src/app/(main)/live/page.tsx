'use client';

import React, { useEffect, useRef } from 'react';
import liveData from '@/data/live_videos.json';
import VideoPlayer from '@/components/features/VideoPlayer';
import { Radio, Music } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/Modal';
import { VideoModal } from '@/components/common/VideoModal';

export default function LivePage() {
    const { isPlaying, closePlayer } = useAudio();
    const router = useRouter();
    const [showAudioConfirm, setShowAudioConfirm] = React.useState(false);
    const [selectedVideo, setSelectedVideo] = React.useState<{ id: string; title: string } | null>(null);
    // Use a ref to track if we've already checked on mount
    const hasCheckedAudio = useRef(false);

    useEffect(() => {
        if (isPlaying) {
            // If music is playing, we want to show the overlay unless the user
            // already acknowledged it for this specific session on this page.
            if (!hasCheckedAudio.current) {
                setShowAudioConfirm(true);
                hasCheckedAudio.current = true;
            }
        } else {
            // If music stops, we can reset the check so it works again if music starts
            hasCheckedAudio.current = false;
        }
    }, [isPlaying]);

    const handleConfirmAudioStop = () => {
        closePlayer();
        setShowAudioConfirm(false);
    };

    const handleCancelAudioStop = () => {
        setShowAudioConfirm(false);
        router.back();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-6 px-4">

            {/* Header */}
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 flex-none">
                    <Radio className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-ochre">Live Darshan</h1>
                    <p className="text-sm text-gray-500 font-serif italic">"Experience the divine presence"</p>
                </div>
            </div>
            {/* Live Banner */}
            {liveData.live_status && (
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                    <div className="bg-red-600 text-white px-4 py-2 flex items-center font-bold text-sm tracking-wider uppercase">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        Live Now
                    </div>
                    <div className="grid lg:grid-cols-3">
                        <div className="lg:col-span-2 aspect-video bg-gray-900 relative">
                            {isPlaying && !hasCheckedAudio.current ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
                                    <div className="p-3 bg-white/10 rounded-full">
                                        <Music className="w-8 h-8 text-white/40" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white font-bold text-sm text-balance">Audio is currently playing</p>
                                        <p className="text-gray-400 text-xs text-balance">Stop music to experience the Live Darshan</p>
                                    </div>
                                    <button
                                        onClick={() => setShowAudioConfirm(true)}
                                        className="bg-white text-black text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                                    >
                                        Allow Live Stream
                                    </button>
                                </div>
                            ) : (
                                <VideoPlayer
                                    videoId={liveData.live_video.youtube_id}
                                    streamUrl={liveData.live_video.stream_url}
                                />
                            )}
                        </div>
                        <div className="p-6 text-white space-y-4 flex flex-col justify-center">
                            <h2 className="text-2xl font-bold">{liveData.live_video.title}</h2>
                            <p className="text-gray-300 leading-relaxed text-sm">
                                {liveData.live_video.description}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Past Streams Library */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <span className="w-1 h-6 bg-ochre mr-3 rounded-full" />
                        Streams from Saileela Rahasya
                    </h2>
                    <a
                        href="https://www.youtube.com/@saileelarahasya/streams"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center"
                    >
                        View Channel
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {liveData.past_streams.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => setSelectedVideo({ id: video.youtube_id, title: video.title })}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group cursor-pointer"
                        >
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {/* YouTube Thumbnail */}
                                <img
                                    src={`https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                                    alt={video.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-ochre font-bold mb-1">{video.date}</div>
                                <h3 className="font-bold text-gray-800 group-hover:text-ochre transition-colors line-clamp-2">
                                    {video.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={showAudioConfirm}
                onClose={handleCancelAudioStop}
                title="Stop Music?"
                actions={
                    <>
                        <button
                            onClick={handleCancelAudioStop}
                            className="w-full py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition"
                        >
                            No, Go Back
                        </button>
                        <button
                            onClick={handleConfirmAudioStop}
                            className="w-full py-3 rounded-xl bg-ochre text-white font-bold hover:bg-orange-700 transition shadow-lg"
                        >
                            Yes, Stop Music
                        </button>
                    </>
                }
            >
                Music is currently playing. Would you like to stop it to watch the live stream?
            </Modal>

            {/* Video Modal for Past Streams */}
            {selectedVideo && (
                <VideoModal
                    isOpen={!!selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    videoId={selectedVideo.id}
                    title={selectedVideo.title}
                />
            )}
        </div>
    );
}
