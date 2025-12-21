'use client';

import React, { useEffect, useRef } from 'react';
import liveData from '@/data/live_videos.json';
import VideoPlayer from '@/components/features/VideoPlayer';
import { Radio } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/common/Modal';

export default function LivePage() {
    const { isPlaying, closePlayer } = useAudio();
    const router = useRouter();
    const [showAudioConfirm, setShowAudioConfirm] = React.useState(false);
    const hasCheckedAudio = useRef(false);

    useEffect(() => {
        if (!hasCheckedAudio.current && isPlaying) {
            setShowAudioConfirm(true);
            hasCheckedAudio.current = true;
        }
    }, [isPlaying]);

    // Live Schedule: Active from 3:30 AM to 12:00 AM (Midnight) IST
    const [isLiveActive, setIsLiveActive] = React.useState(false);

    useEffect(() => {
        const checkSchedule = () => {
            // Get current time in India Standard Time
            const now = new Date();
            const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const istDate = new Date(istString);

            const hours = istDate.getHours();
            const minutes = istDate.getMinutes();
            const timeInMinutes = hours * 60 + minutes;

            const START_TIME = 3 * 60 + 30; // 3:30 AM
            const END_TIME = 24 * 60;       // 12:00 AM (Midnight)

            const isActive = timeInMinutes >= START_TIME && timeInMinutes < END_TIME;

            // Set active based on schedule only
            setIsLiveActive(isActive);
        };

        checkSchedule();
        const interval = setInterval(checkSchedule, 60000); // Check every minute
        return () => clearInterval(interval);
    }, []);

    const handleConfirmAudioStop = () => {
        closePlayer();
        setShowAudioConfirm(false);
    };

    const handleCancelAudioStop = () => {
        setShowAudioConfirm(false);
        router.back();
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pt-6 px-4 pb-24">

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

            {/* Featured Live Darshan Block - Always Visible */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
                {/* Live Indicator - Only during scheduled hours */}
                {isLiveActive && (
                    <div className="bg-red-600 text-white px-4 py-2 flex items-center font-bold text-sm tracking-wider uppercase">
                        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                        Live Now
                    </div>
                )}

                {!isLiveActive && (
                    <div className="bg-gray-800 text-white px-4 py-2 flex items-center font-bold text-sm tracking-wider uppercase">
                        <span className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                        Off Schedule
                    </div>
                )}

                <div className="grid lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {isLiveActive ? (
                            /* Live Video - During scheduled hours */
                            <VideoPlayer
                                videoId={liveData.live_video.youtube_id}
                                streamUrl={liveData.live_video.stream_url}
                            />
                        ) : (
                            /* Offline Placeholder - Outside scheduled hours */
                            <div className="relative w-full pb-[56.25%] bg-gradient-to-br from-ochre/20 via-gray-900 to-black">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                    <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-gray-700">
                                        <Radio className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Live Darshan Offline</h3>
                                    <p className="text-gray-400 text-sm text-center max-w-md mb-4">
                                        Featured live darshan is available daily from
                                    </p>
                                    <div className="text-ochre font-bold text-lg">
                                        3:30 AM - 12:00 AM IST
                                    </div>
                                    <p className="text-gray-500 text-xs mt-4">
                                        Check past streams below for recorded content
                                    </p>
                                </div>
                            </div>
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
                        <div key={video.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                            <div className="aspect-video bg-gray-100 relative">
                                {/* Placeholder for actual thumbnail logic */}
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    <VideoPlayer videoId={video.youtube_id} />
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
        </div>
    );
}
