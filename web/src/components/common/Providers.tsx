'use client';

import { ReactNode } from 'react';
import { AudioProvider } from '@/context/AudioContext';
import { InquiryProvider } from '@/context/InquiryContext';
import audioTracks from '@/data/audio_tracks.json';

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <InquiryProvider>
            <AudioProvider allTracks={audioTracks as any}>
                {children}
            </AudioProvider>
        </InquiryProvider>
    );
}
