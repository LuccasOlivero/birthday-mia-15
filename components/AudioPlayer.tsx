"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true; // ← forzado por JS además del atributo HTML
    audio.currentTime = 1.2;

    const handleInteraction = async () => {
      if (hasInteracted.current) return;
      hasInteracted.current = true;
      try {
        audio.currentTime = 1.2;
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Error al reproducir:", error);
      }
    };

    const events = ["scroll", "touchstart", "click"] as const;
    events.forEach((e) =>
      window.addEventListener(e, handleInteraction, { once: true }),
    );

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleInteraction));
    };
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  return (
    <>
      <audio ref={audioRef} src="/song.mp3" loop preload="auto" />
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 left-6 bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-lg hover:bg-white transition-all z-50"
        aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </>
  );
}
