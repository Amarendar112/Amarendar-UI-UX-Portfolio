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

              {/* ── Mute badge — always visible, covers watermark ─────────── */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                zIndex: 6,
                /* large enough to fully blot out any bottom-right watermark */
                width: 'clamp(56px, 9%, 72px)',
                height: 'clamp(56px, 9%, 72px)',
                background:
                  'radial-gradient(circle at 60% 60%, rgba(10,10,20,0.96) 0%, rgba(0,0,0,0.88) 100%)',
                backdropFilter: 'blur(14px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(14px) saturate(1.4)',
                borderTopLeftRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.13)',
                borderBottom: 'none',
                borderRight: 'none',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.08), 0 -2px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                /* always visible — no opacity transition */
                opacity: 1,
              }}>
                {/* Bold muted speaker icon */}
                <svg
                  width="28" height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'block', marginTop: '6px', marginLeft: '6px' }}
                >
                  {/* Speaker body */}
                  <path
                    d="M11 5L6 9H2v6h4l5 4V5z"
                    fill="rgba(255,255,255,0.9)"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="0.5"
                    strokeLinejoin="round"
                  />
                  {/* Bold X (muted) */}
                  <line x1="22" y1="9" x2="16" y2="15" stroke="rgba(255,255,255,0.95)" strokeWidth="3" strokeLinecap="round" />
                  <line x1="16" y1="9" x2="22" y2="15" stroke="rgba(255,255,255,0.95)" strokeWidth="3" strokeLinecap="round" />
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
