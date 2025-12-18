'use client';

import { useState } from 'react';
import audioTracks from '@/data/audio_tracks.json';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Music, Loader2 } from 'lucide-react';

export default function AudioPage() {
    const { playTrack, currentTrack, isPlaying, togglePlay, isLoading } = useAudio();
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Calculate category counts and sort by popularity
    const categoryCounts = audioTracks.reduce((acc, track) => {
        acc[track.category] = (acc[track.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Get sorted categories
    const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);

    // Desktop: Show all
    const desktopCategories = ['All', ...sortedCategories];

    // Mobile: Top 2 + Other
    const TOP_CATEGORIES_LIMIT = 2;
    const topCategories = sortedCategories.slice(0, TOP_CATEGORIES_LIMIT);
    const otherCategories = sortedCategories.slice(TOP_CATEGORIES_LIMIT);
    const mobileCategories = ['All', ...topCategories];
    if (otherCategories.length > 0) {
        mobileCategories.push('Other');
    }

    // Filter tracks
    const filteredTracks = selectedCategory === 'All'
        ? audioTracks
        : selectedCategory === 'Other'
            ? audioTracks.filter(track => otherCategories.includes(track.category))
            : audioTracks.filter(track => track.category === selectedCategory);

    const handleTrackClick = (track: typeof audioTracks[0]) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            playTrack(track);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 mb-24 pt-6">
            {/* Header */}
            <div className="flex items-center space-x-4 pb-2 border-b border-gray-100 px-4">
                <div className="w-12 h-12 bg-ochre/10 rounded-full flex items-center justify-center text-ochre flex-none">
                    <Music className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sai Bhajans</h1>
                    <p className="text-sm text-gray-500 font-serif italic">"Melodies of devotion"</p>
                </div>
            </div>

            {/* Mobile Category Filters (Top + Other) */}
            <div className="md:hidden overflow-x-auto pb-2 px-4 scrollbar-hide">
                <div className="flex space-x-2 min-w-max">
                    {mobileCategories.map((category) => {
                        // Count logic for Mobile
                        let count = 0;
                        if (category === 'All') count = audioTracks.length;
                        else if (category === 'Other') count = otherCategories.reduce((acc, c) => acc + categoryCounts[c], 0);
                        else count = categoryCounts[category];

                        // Active state logic for Mobile
                        const isActive = selectedCategory === category ||
                            (category === 'Other' && otherCategories.includes(selectedCategory));

                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center space-x-2 ${isActive
                                    ? 'bg-ochre text-white border-ochre shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-ochre/50 hover:bg-orange-50'
                                    }`}
                            >
                                <span>{category}</span>
                                <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Desktop Category Filters (All) */}
            <div className="hidden md:block overflow-x-auto pb-2 scrollbar-hide px-4">
                <div className="flex flex-wrap gap-2">
                    {desktopCategories.map((category) => {
                        const count = category === 'All' ? audioTracks.length : categoryCounts[category];
                        return (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center space-x-2 ${selectedCategory === category
                                    ? 'bg-ochre text-white border-ochre shadow-md transform scale-105'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-ochre/50 hover:bg-orange-50'
                                    }`}
                            >
                                <span>{category}</span>
                                <span className={`text-xs ${selectedCategory === category ? 'text-white/80' : 'text-gray-400'}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mx-4">
                {filteredTracks.length > 0 ? (
                    filteredTracks.map((track, index) => {
                        const isCurrent = currentTrack?.id === track.id;

                        return (
                            <div
                                key={track.id}
                                onClick={() => handleTrackClick(track)}
                                className={`flex items-center p-3 md:p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-orange-50/50 transition-colors active:bg-orange-100/50 ${isCurrent ? 'bg-orange-50' : ''
                                    }`}
                            >
                                {/* Index */}
                                <span className={`w-8 text-center text-sm font-medium flex-shrink-0 ${isCurrent ? 'text-ochre' : 'text-gray-400'}`}>
                                    {index + 1}
                                </span>

                                {/* Meta */}
                                <div className="flex-1 px-3 md:px-4 min-w-0">
                                    <h3 className={`font-bold break-words leading-tight ${isCurrent ? 'text-ochre' : 'text-gray-800'}`}>
                                        {track.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-0.5">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded flex-shrink-0">{track.category}</span>
                                        {track.singer && track.singer !== 'Unknown' && (
                                            <>
                                                <span>•</span>
                                                <span className="break-words">{track.singer}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Action Icon */}
                                <div className={`p-3 rounded-full flex-shrink-0 transition-all duration-200 ${isCurrent
                                    ? 'bg-ochre text-white shadow-md scale-105'
                                    : 'bg-orange-50 text-ochre hover:bg-ochre hover:text-white hover:shadow-sm'
                                    }`}>
                                    {isCurrent && isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isCurrent && isPlaying ? (
                                        <Pause className="w-5 h-5 fill-current" />
                                    ) : (
                                        <Play className="w-5 h-5 fill-current ml-0.5" />
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No audio tracks found in this category.
                    </div>
                )}
            </div>
        </div>
    );
}
