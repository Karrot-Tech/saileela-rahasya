"use client";

"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  videoId?: string;
  streamUrl?: string;
  poster?: string;
}

export default function VideoPlayer({ videoId, streamUrl, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!streamUrl || !videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(() => { });
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Native support (Safari)
      videoRef.current.src = streamUrl;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current?.play().catch(() => { });
      });
    }
  }, [streamUrl]);

  if (streamUrl) {
    return (
      <div
        className="relative w-full pb-[56.25%] overflow-hidden rounded-lg shadow-lg bg-black z-10"
        style={{
          touchAction: 'manipulation',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          isolation: 'isolate'
        }}
      >
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-contain"
          controls
          poster={poster}
          playsInline
          style={{
            touchAction: 'manipulation',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        />
      </div>
    );
  }

  if (videoId) {
    return (
      <div
        className="relative w-full pb-[56.25%] overflow-hidden rounded-lg shadow-lg bg-black z-10"
        style={{
          touchAction: 'manipulation',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          isolation: 'isolate'
        }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            touchAction: 'manipulation',
            WebkitTransform: 'translateZ(0)',
            transform: 'translateZ(0)'
          }}
        />
      </div>
    );
  }

  return null;
}
