import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────
   IntroVideo
   · Hover section  → plays muted preview
   · Hover out      → pauses + resets (only if preview mode)
   · Scroll away    → pauses + resets
   · Always muted   → no audio output
   ───────────────────────────────────────────────────────────────────────── */

const IntroVideo = () => {
  const sectionRef  = useRef(null);
  const videoRef    = useRef(null);
  const fadeRafRef  = useRef(null);    // cancel any running loops

  const [inView, setInView] = useState(false);

  // ── Motion values (declared FIRST — used in handlers below) ──────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltX   = useSpring(useTransform(mouseY, [-350, 350], [ 8, -8  ]), { stiffness: 85, damping: 22 });
  const tiltY   = useSpring(useTransform(mouseX, [-500, 500], [-10, 10 ]), { stiffness: 85, damping: 22 });
  const shadowX = useSpring(useTransform(mouseX, [-500, 500], [ 12,-12 ]), { stiffness: 85, damping: 22 });
  const glareX  = useSpring(useTransform(mouseX, [-500, 500], [-30, 30 ]), { stiffness: 85, damping: 22 });
  const glareY  = useSpring(useTransform(mouseY, [-350, 350], [-20, 20 ]), { stiffness: 85, damping: 22 });

  // ── Video actions ─────────────────────────────────────────────────────────
  const playMutedFromStart = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume      = 0;
    vid.muted       = true;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, []);

  const pauseAndReset = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.pause();
    vid.currentTime = 0;
    vid.muted  = true;
    vid.volume = 0;
  }, []);

  const handleClick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    // Always stays muted — toggle play/pause only
    vid.paused ? vid.play().catch(() => {}) : vid.pause();
  }, []);

  // ── Intersection Observer ─────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          pauseAndReset();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pauseAndReset]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    };
  }, []);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (r.left + r.width  / 2));
    mouseY.set(e.clientY - (r.top  + r.height / 2));
  };

  const handleMouseEnter = useCallback(() => {
    // Only auto-play muted preview if user hasn't clicked to unmute
    if (!soundOnRef.current) {
      playMutedFromStart();
    }
  }, [playMutedFromStart]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    // Only reset if still in muted preview mode (not if user clicked for sound)
    if (!soundOnRef.current) {
      pauseAndReset();
    }
  }, [pauseAndReset]);

  // ── Styling helpers ───────────────────────────────────────────────────────
  const tr = (d = 0) =>
    `opacity 0.9s ${d}s cubic-bezier(0.22,1,0.36,1), transform 0.9s ${d}s cubic-bezier(0.22,1,0.36,1)`;
  const W = 'min(92vw, 860px)';

  return (
    <section
      ref={sectionRef}
      id="intro-video"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '100%',
        background: 'var(--bg, #080808)',
        padding: '60px 20px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
        overflow: 'hidden',
      }}
    >
      {/* Eyebrow */}
      <p style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: 'clamp(10px,0.85vw,12px)',
        fontWeight: 500,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.34)',
        margin: '0 0 16px',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(14px)',
        transition: tr(0),
      }}>Showreel</p>

      {/* Title */}
      <h2 style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: 'clamp(26px,3.8vw,54px)',
        fontWeight: 700,
        color: '#fff',
        margin: '0 0 40px',
        letterSpacing: '-0.025em',
        lineHeight: 1.1,
        textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(18px)',
        transition: tr(0.08),
      }}>
        Creative Process
        <span style={{ color: 'rgba(255,255,255,0.35)', display: 'block' }}>In Motion</span>
      </h2>

      {/* ══ Phone mockup wrapper ══════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 48 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 48 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          width: W,
          marginTop: '-21.5%',
          marginBottom: '-21.5%',
          userSelect: 'none',
          perspective: 1500,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Ground shadow */}
        <motion.div
          animate={inView
            ? { scale: [0.94, 1.05, 0.94], opacity: [0.42, 0.22, 0.42] }
            : { scale: 0.94, opacity: 0.42 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '73.2%', left: '8%', right: '8%', height: '32px',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 55%, transparent 80%)',
            filter: 'blur(20px)', zIndex: 1, pointerEvents: 'none', x: shadowX,
          }}
        />

        {/* Floating container */}
        <motion.div
          animate={inView ? { y: [0, -14, 0] } : { y: 0 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', width: '100%', zIndex: 2, transformStyle: 'preserve-3d' }}
        >
          {/* 3D tilt */}
          <motion.div style={{
            position: 'relative', width: '100%', transformStyle: 'preserve-3d',
            rotateX: tiltX, rotateY: tiltY,
          }}>
            {/* Mockup PNG */}
            <img
              src="/phone_mockup_clean.png"
              alt="Phone Mockup"
              style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
            />

            {/* Screen container */}
            <div
              onClick={handleClick}
              style={{
                position: 'absolute',
                left: '6.84%', top: '28.81%', width: '86.33%', height: '42.38%',
                borderRadius: '4.8% / 9.8%',
                overflow: 'hidden',
                background: '#000',
                zIndex: 2,
                WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                clipPath: 'inset(0% round 4.8% / 9.8%)',
                transform: 'translate3d(0, 0, 0)',
                willChange: 'transform',
                cursor: 'pointer',
              }}
            >
              <video
                ref={videoRef}
                src="/intro_video.mp4"
                muted
                loop
                playsInline
                preload="auto"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center center',
                  display: 'block', pointerEvents: 'none',
                  transform: 'scale(1.08) translate(-0.5%, -0.5%)',
                }}
              />

              {/* Dynamic Island */}
              <div style={{
                position: 'absolute', left: '1.36%', top: '50%',
                transform: 'translateY(-50%)',
                width: '3.62%', height: '25.34%',
                background: '#000', borderRadius: '999px',
                zIndex: 3, boxShadow: '0 0 2px rgba(0,0,0,0.6)',
              }} />

              {/* Glass glare */}
              <motion.div style={{
                position: 'absolute', inset: '-20%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 30%, transparent 60%, rgba(255,255,255,0.02) 100%)',
                pointerEvents: 'none', zIndex: 4, x: glareX, y: glareY,
              }} />

              {/* ── Mute badge — circular glassmorphism, always visible, covers watermark ── */}
              <div style={{
                position: 'absolute',
                bottom: '8%',
                right: '6%',
                zIndex: 6,
                /* Circle large enough to cover any bottom-right watermark */
                width: 'clamp(44px, 11%, 58px)',
                height: 'clamp(44px, 11%, 58px)',
                borderRadius: '50%',
                /* Deep glass — matches reference photo dark background */
                background: 'radial-gradient(circle at 38% 32%, rgba(60,60,75,0.72) 0%, rgba(12,12,18,0.92) 70%)',
                backdropFilter: 'blur(18px) saturate(1.6) brightness(0.9)',
                WebkitBackdropFilter: 'blur(18px) saturate(1.6) brightness(0.9)',
                /* Thin white border + top-highlight arc (Apple-style) */
                border: '1px solid rgba(255,255,255,0.22)',
                boxShadow: [
                  'inset 0 1.5px 2px rgba(255,255,255,0.18)',   /* top gloss arc */
                  'inset 0 -1px 2px rgba(0,0,0,0.4)',            /* bottom inner shadow */
                  '0 6px 24px rgba(0,0,0,0.65)',                 /* outer drop shadow */
                  '0 2px 6px rgba(0,0,0,0.4)',
                ].join(', '),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                opacity: 1,
                overflow: 'hidden',
              }}>
                {/* Subtle top-left gloss shimmer */}
                <div style={{
                  position: 'absolute',
                  top: '-30%', left: '-15%',
                  width: '70%', height: '60%',
                  background: 'radial-gradient(ellipse at 40% 40%, rgba(255,255,255,0.12) 0%, transparent 75%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }} />

                {/* Speaker with sound-waves icon — 68% of circle */}
                <svg
                  width="65%" height="65%"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'block', position: 'relative', zIndex: 1 }}
                >
                  {/* Speaker body — solid fill */}
                  <path
                    d="M3 9v6h4l5 5V4L7 9H3z"
                    fill="white"
                  />
                  {/* Inner sound wave */}
                  <path
                    d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                    fill="white"
                  />
                  {/* Outer sound wave */}
                  <path
                    d="M19 12c0-3.53-2.04-6.58-5-8.05v2.2c1.84 1.32 3 3.41 3 5.85 0 2.44-1.16 4.53-3 5.85v2.2c2.96-1.47 5-4.52 5-8.05z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Caption */}
      <p style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: 'clamp(12px,1.1vw,14px)',
        color: 'rgba(255,255,255,0.22)',
        margin: '28px 0 0', letterSpacing: '0.03em', textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(12px)',
        transition: tr(0.44),
      }}>
        Hover to preview · Click to play
      </p>
    </section>
  );
};

export default IntroVideo;
