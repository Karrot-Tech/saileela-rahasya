'use client';

import { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { X, PlayCircle } from 'lucide-react';

interface VideoData {
    id: string | number;
    youtube_id: string;
    title?: string;
    description?: string;
}

interface ReferenceVideosProps {
    videos: VideoData[];
}

export default function ReferenceVideos({ videos }: ReferenceVideosProps) {
    const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);

    return (
        <div className="w-full">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center mb-4">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Reference Videos
            </h3>

            {/* Mobile View: Horizontal Thumbnails */}
            <div className="lg:hidden flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="flex-none w-40 cursor-pointer group"
                        onClick={() => setSelectedVideo(video)}
                    >
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative shadow-sm border border-gray-200">
                            <img
                                src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                                alt="Video thumbnail"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                                <PlayCircle className="w-8 h-8 text-white/90" />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-700 font-medium line-clamp-2">
                            {video.description || video.title || 'Watch Video'}
                        </p>
                    </div>
                ))}
            </div>

            {/* Desktop View: Vertical List with Players */}
            <div className="hidden lg:flex flex-col space-y-6">
                {videos.map((video) => (
                    <div key={video.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                        <VideoPlayer videoId={video.youtube_id} />
                        {(video.description || video.title) && (
                            <div className="mt-3">
                                {video.title && <h4 className="font-bold text-gray-800 text-sm mb-1">{video.title}</h4>}
                                {video.description && <p className="text-sm text-gray-600 line-clamp-3">{video.description}</p>}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 lg:hidden animate-in fade-in duration-200">
                    <div className="relative w-full max-w-lg bg-black rounded-lg overflow-hidden shadow-2xl">
                        <button
                            onClick={() => setSelectedVideo(null)}
                            className="absolute top-2 right-2 text-white/80 hover:text-white z-10 p-2 bg-black/50 rounded-full"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="w-full">
                            <VideoPlayer videoId={selectedVideo.youtube_id} />
                        </div>
                        {(selectedVideo.description || selectedVideo.title) && (
                            <div className="p-4 bg-gray-900 text-white">
                                {selectedVideo.title && <h4 className="font-bold mb-1">{selectedVideo.title}</h4>}
                                {selectedVideo.description && <p className="text-sm text-gray-300">{selectedVideo.description}</p>}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
