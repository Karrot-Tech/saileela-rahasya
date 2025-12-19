'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

export interface Track {
    id: number;
    title: string;
    singer: string;
    category: string;
    url: string;
    cover?: string;
}

interface AudioContextType {
    currentTrack: Track | null;
    isPlaying: boolean;
    isLoading: boolean;
    progress: number;
    playTrack: (track: Track) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrev: () => void;
    closePlayer: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children, allTracks }: { children: React.ReactNode, allTracks: Track[] }) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playTrack = useCallback((track: Track) => {
        if (audioRef.current) {
            setIsLoading(true); // Set loading immediately
            audioRef.current.src = track.url;
            audioRef.current.play().catch(e => {
                console.error("Playback failed:", e);
                setIsLoading(false);
            });
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
        }
    }, [isPlaying]);

    const playNext = useCallback(() => {
        if (!currentTrack) return;
        const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % allTracks.length;
        playTrack(allTracks[nextIndex]);
    }, [allTracks, currentTrack, playTrack]);

    const playPrev = useCallback(() => {
        if (!currentTrack) return;
        const currentIndex = allTracks.findIndex(t => t.id === currentTrack.id);
        const prevIndex = (currentIndex - 1 + allTracks.length) % allTracks.length;
        playTrack(allTracks[prevIndex]);
    }, [allTracks, currentTrack, playTrack]);

    // Initialize Audio
    useEffect(() => {
        audioRef.current = new Audio();

        const handleEnded = () => playNext();
        const handleTimeUpdate = () => {
            if (audioRef.current) {
                const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                setProgress(isNaN(p) ? 0 : p);
            }
        };

        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handlePlaying = () => setIsLoading(false);
        const handleLoadStart = () => setIsLoading(true);

        audioRef.current.addEventListener('ended', handleEnded);
        audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.addEventListener('waiting', handleWaiting);
        audioRef.current.addEventListener('canplay', handleCanPlay);
        audioRef.current.addEventListener('playing', handlePlaying);
        audioRef.current.addEventListener('loadstart', handleLoadStart);

        return () => {
            audioRef.current?.removeEventListener('ended', handleEnded);
            audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
            audioRef.current?.removeEventListener('waiting', handleWaiting);
            audioRef.current?.removeEventListener('canplay', handleCanPlay);
            audioRef.current?.removeEventListener('playing', handlePlaying);
            audioRef.current?.removeEventListener('loadstart', handleLoadStart);
        };
    }, [playNext]);

    // Media Session Support (Lock Screen Controls)
    useEffect(() => {
        if (typeof window !== 'undefined' && 'mediaSession' in navigator && currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: currentTrack.singer && currentTrack.singer !== 'Unknown' ? currentTrack.singer : 'Sai Rahasya',
                album: currentTrack.category,
                artwork: [
                    { src: '/app-icon.png', sizes: '512x512', type: 'image/png' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', togglePlay);
            navigator.mediaSession.setActionHandler('pause', togglePlay);
            navigator.mediaSession.setActionHandler('previoustrack', playPrev);
            navigator.mediaSession.setActionHandler('nexttrack', playNext);

            return () => {
                navigator.mediaSession.setActionHandler('play', null);
                navigator.mediaSession.setActionHandler('pause', null);
                navigator.mediaSession.setActionHandler('previoustrack', null);
                navigator.mediaSession.setActionHandler('nexttrack', null);
            };
        }
    }, [currentTrack, playNext, playPrev, togglePlay]);

    // Sync playback state with Media Session
    useEffect(() => {
        if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
            navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
        }
    }, [isPlaying]);

    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
        setIsLoading(false);
        setCurrentTrack(null);
        setProgress(0);
    };

    return (
        <AudioContext.Provider value={{ currentTrack, isPlaying, isLoading, progress, playTrack, togglePlay, playNext, playPrev, closePlayer }}>
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
