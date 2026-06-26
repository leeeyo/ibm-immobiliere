"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const POSTER_SRC = "/hero/hero-tower.jpg";
const VIDEO_DESKTOP = "/hero/hero-tower.mp4";
const VIDEO_MOBILE = "/hero/hero-tower-mobile.mp4";

/**
 * Cinematic hero backdrop:
 *  - Poster image renders immediately (LCP-friendly, `priority`).
 *  - After mount, opportunistically picks a video src for the viewport
 *    (9:16 on phones, 16:9 on tablets+), provided the user has not requested
 *    reduced motion and the connection is not flagged as save-data / slow-2g.
 *  - Video fades in once it can play; otherwise the still remains.
 */
export default function HeroBackdrop() {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    type NavConn = { saveData?: boolean; effectiveType?: string };
    const conn = (navigator as Navigator & { connection?: NavConn }).connection;
    const networkOk = !conn || (!conn.saveData && !/(^|-)(2g|slow-2g)$/i.test(conn.effectiveType || ""));

    if (motionOk && networkOk) {
      setVideoSrc(isMobile ? VIDEO_MOBILE : VIDEO_DESKTOP);
    }
  }, []);

  useEffect(() => {
    if (!videoSrc || !videoRef.current) return;
    const v = videoRef.current;
    const onReady = () => setVideoReady(true);
    v.addEventListener("canplaythrough", onReady, { once: true });
    v.addEventListener("loadeddata", onReady, { once: true });
    return () => {
      v.removeEventListener("canplaythrough", onReady);
      v.removeEventListener("loadeddata", onReady);
    };
  }, [videoSrc]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={POSTER_SRC}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`object-cover transition-opacity duration-[1200ms] ${
          videoReady ? "opacity-0" : "opacity-100 drift"
        }`}
      />

      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={POSTER_SRC}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ${
            videoReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      {/* Cinematic legibility overlays */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[var(--color-navy-950)]/65 via-[var(--color-navy-950)]/35 to-[var(--color-navy-950)]/85"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy-950)]/55 via-transparent to-transparent"
      />
      <div aria-hidden className="grain" />
    </div>
  );
}
