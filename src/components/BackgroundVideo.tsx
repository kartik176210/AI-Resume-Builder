import { useEffect, useRef } from 'react';

const SENSITIVITY = 0.8;
const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4';

export default function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const seekTo = (time: number) => {
      if (!video.duration || Number.isNaN(video.duration)) return;
      const clamped = Math.min(Math.max(time, 0), video.duration);
      targetTime.current = clamped;
      if (!seeking.current) {
        seeking.current = true;
        video.currentTime = clamped;
      }
    };

    const handleSeeked = () => {
      if (Math.abs(video.currentTime - targetTime.current) > 0.03) {
        video.currentTime = targetTime.current;
      } else {
        seeking.current = false;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (prevX.current === null) {
        prevX.current = e.clientX;
        return;
      }
      const delta = e.clientX - prevX.current;
      prevX.current = e.clientX;
      if (!video.duration) return;
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      const base = seeking.current ? targetTime.current : video.currentTime;
      seekTo(base + offset);
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 w-full h-full object-cover"
      style={{ objectPosition: '70% center', zIndex: 0 }}
    />
  );
}
