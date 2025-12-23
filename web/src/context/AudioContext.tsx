'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

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

    // Refs for state to avoid closure issues in event listeners
    const currentTrackRef = useRef<Track | null>(null);
    const allTracksRef = useRef<Track[]>(allTracks);

    useEffect(() => {
        currentTrackRef.current = currentTrack;
    }, [currentTrack]);

    useEffect(() => {
        allTracksRef.current = allTracks;
    }, [allTracks]);

    const playTrack = (track: Track) => {
        if (audioRef.current) {
            setIsLoading(true);
            audioRef.current.src = track.url;
            audioRef.current.play().catch(e => {
                console.error("Playback failed:", e);
                setIsLoading(false);
            });
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const playNext = () => {
        const track = currentTrackRef.current;
        const tracks = allTracksRef.current;
        if (!track || tracks.length === 0) return;
        const currentIndex = tracks.findIndex(t => t.id === track.id);
        const nextIndex = (currentIndex + 1) % tracks.length;
        playTrack(tracks[nextIndex]);
    };

    const playPrev = () => {
        const track = currentTrackRef.current;
        const tracks = allTracksRef.current;
        if (!track || tracks.length === 0) return;
        const currentIndex = tracks.findIndex(t => t.id === track.id);
        const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        playTrack(tracks[prevIndex]);
    };

    // Initialize Audio
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        const audio = audioRef.current;

        const handleEnded = () => playNext();
        const handleTimeUpdate = () => {
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(isNaN(p) ? 0 : p);
        };

        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handlePlaying = () => {
            setIsLoading(false);
            setIsPlaying(true);
        };
        const handlePause = () => setIsPlaying(false);
        const handlePlay = () => setIsPlaying(true);
        const handleLoadStart = () => setIsLoading(true);
        const handleError = (e: any) => {
            console.error("Audio error:", e);
            setIsLoading(false);
            setIsPlaying(false);
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('waiting', handleWaiting);
        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('playing', handlePlaying);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('loadstart', handleLoadStart);
        audio.addEventListener('error', handleError);

        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('waiting', handleWaiting);
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('playing', handlePlaying);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('loadstart', handleLoadStart);
            audio.removeEventListener('error', handleError);
        };
    }, []);

    // Media Session API Support
    useEffect(() => {
        if (!('mediaSession' in navigator) || !currentTrack) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title,
            artist: currentTrack.singer === 'Unknown' ? 'Saileela Rahasya' : currentTrack.singer,
            album: 'Saileela Rahasya Bhajans',
            artwork: [
                { src: '/saileela-logo.png', sizes: '96x96', type: 'image/png' },
                { src: '/saileela-logo.png', sizes: '128x128', type: 'image/png' },
                { src: '/saileela-logo.png', sizes: '192x192', type: 'image/png' },
                { src: '/saileela-logo.png', sizes: '256x256', type: 'image/png' },
                { src: '/saileela-logo.png', sizes: '384x384', type: 'image/png' },
                { src: '/saileela-logo.png', sizes: '512x512', type: 'image/png' },
            ]
        });

        navigator.mediaSession.setActionHandler('play', () => {
            if (audioRef.current && !isPlaying) {
                audioRef.current.play().catch(console.error);
            }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (audioRef.current && isPlaying) {
                audioRef.current.pause();
            }
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => playPrev());
        navigator.mediaSession.setActionHandler('nexttrack', () => playNext());

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        };
    }, [currentTrack, isPlaying]); // Keep in sync with track and state


    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(console.error);
            }
        }
    };

    const closePlayer = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
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
