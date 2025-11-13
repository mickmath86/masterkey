// components/YouTubeAutoPlay.tsx
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type Props = {
  videoId: string;
  loop?: boolean;
};

export default function YouTubeAutoPlay({ videoId, loop = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Load YouTube API and initialize player
  useEffect(() => {
    const ensureYT = () =>
      new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) return resolve();
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = () => resolve();
        document.body.appendChild(tag);
      });

    let canceled = false;
    (async () => {
      await ensureYT();
      if (canceled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1, // Autoplay allowed only if muted
          mute: 1,
          playsinline: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin:
            typeof window !== "undefined" ? window.location.origin : undefined,
          loop: loop ? 1 : 0,
          playlist: loop ? videoId : undefined, // Needed for looping
        },
        events: {
          onReady: (e: any) => {
            try {
              e.target.mute();
              e.target.playVideo();
              setReady(true);
            } catch (err) {
              console.error("YouTube player error:", err);
            }
          },
          onStateChange: (ev: any) => {
            // Reset mute state if loop disabled and video ends
            if (ev.data === window.YT.PlayerState.ENDED && !loop) {
              setIsMuted(true);
            }
          },
        },
      });
    })();

    return () => {
      canceled = true;
      try {
        playerRef.current?.destroy?.();
      } catch {}
    };
  }, [videoId, loop]);

  // When user taps the overlay
  const handleUnmute = () => {
    if (!playerRef.current) return;
    try {
      playerRef.current.unMute();
      playerRef.current.seekTo(0); // restart video
      playerRef.current.playVideo();
      setIsMuted(false);
    } catch (err) {
      console.error("Unmute error:", err);
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: "16/9" }}
    >
      {/* YouTube Player Mount Point */}
      <div ref={containerRef} className="w-full h-full" />

      {/* Overlay */}
      {ready && isMuted && (
        <button
          onClick={handleUnmute}
          className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-base font-medium transition-opacity duration-300 hover:bg-black/40"
          aria-label="Unmute video"
          title="Tap to enable sound"
        >
          <div className="px-4 py-2 rounded-full bg-sky-500 text-white shadow-md">
            🔊 Tap for sound
          </div>
        </button>
      )}
    </div>
  );
}
