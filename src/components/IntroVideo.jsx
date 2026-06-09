import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────
   IntroVideo
   · Hover section  → plays muted preview from beginning
   · Click screen   → toggles mute/unmute (audio fades in on first unmute)
   · Mute button    → always visible, covers Gemini watermark at bottom-right
   · Hover out      → pauses + resets if still in muted preview mode
   · Scroll away    → pauses + resets to 0
   ───────────────────────────────────────────────────────────────────────── */

const IntroVideo = () => {
  const sectionRef    = useRef(null);
  const videoRef      = useRef(null);
  const soundOnRef    = useRef(false);   // track unmuted state without re-renders
  const fadeRafRef    = useRef(null);    // cancel any running audio-fade loop
  const everPlayedRef = useRef(false);   // whether user has ever clicked to play with sound

  const [inView,  setInView]  = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // ── Motion values ─────────────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const tiltX   = useSpring(useTransform(mouseY, [-350, 350], [ 8, -8  ]), { stiffness: 85, damping: 22 });
  const tiltY   = useSpring(useTransform(mouseX, [-500, 500], [-10, 10 ]), { stiffness: 85, damping: 22 });
  const shadowX = useSpring(useTransform(mouseX, [-500, 500], [ 12,-12 ]), { stiffness: 85, damping: 22 });
  const glareX  = useSpring(useTransform(mouseX, [-500, 500], [-30, 30 ]), { stiffness: 85, damping: 22 });
  const glareY  = useSpring(useTransform(mouseY, [-350, 350], [-20, 20 ]), { stiffness: 85, damping: 22 });

  // ── Audio fade helper ─────────────────────────────────────────────────────
  const fadeInAudio = useCallback((vid, durationMs = 600) => {
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    const start = performance.now();
    const step = (now) => {
      if (!vid || vid.paused) return;
      const t = Math.min((now - start) / durationMs, 1);
      vid.volume = t;
      if (t < 1) fadeRafRef.current = requestAnimationFrame(step);
    };
    fadeRafRef.current = requestAnimationFrame(step);
  }, []);

  // ── Video actions ─────────────────────────────────────────────────────────
  const playMutedFromStart = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    vid.volume      = 0;
    vid.muted       = true;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, []);

  const pauseAndReset = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
    vid.pause();
    vid.currentTime = 0;
    vid.muted       = true;
    vid.volume      = 0;
    soundOnRef.current = false;
    setSoundOn(false);
    everPlayedRef.current = false;
  }, []);

  // ── Initialize video muted via JS on mount (NOT via HTML attribute) ────────
  // Using the HTML `muted` attribute locks the element and prevents JS unmuting.
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted  = true;
    vid.volume = 0;
  }, []);

  // ── Mute toggle — MUST happen synchronously inside click event ───────────
  const handleClick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!soundOnRef.current) {
      // ── UNMUTE ──────────────────────────────────────────────────────────
      // Browser autoplay policy: muted=false MUST be set synchronously here,
      // inside the trusted click event. Never defer to .then().
      if (!everPlayedRef.current) vid.currentTime = 0;
      vid.muted  = false;   // synchronous — browser allows this in click handler
      vid.volume = 0;       // start silent, fade will ramp up

      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            fadeInAudio(vid, 600);      // ramp volume 0 → 1 over 600 ms
            soundOnRef.current    = true;
            everPlayedRef.current = true;
            setSoundOn(true);
          })
          .catch(() => {
            // Browser blocked play — revert to safe muted state
            vid.muted  = true;
            vid.volume = 0;
          });
      } else {
        // Older browsers — no promise returned, assume play started
        fadeInAudio(vid, 600);
        soundOnRef.current    = true;
        everPlayedRef.current = true;
        setSoundOn(true);
      }
    } else {
      // ── MUTE ──────────────────────────────────────────────────────────
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current);
      vid.volume = 0;
      vid.muted  = true;
      soundOnRef.current = false;
      setSoundOn(false);
    }
  }, [fadeInAudio]);

  // ── Mute button click (separate from screen click) ────────────────────────
  const handleMuteToggle = useCallback((e) => {
    e.stopPropagation(); // don't bubble to screen click
    handleClick();
  }, [handleClick]);

  // ── Intersection Observer ─────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) pauseAndReset();
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [pauseAndReset]);

  // Cleanup
  useEffect(() => {
    return () => { if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current); };
  }, []);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (r.left + r.width  / 2));
    mouseY.set(e.clientY - (r.top  + r.height / 2));
  };

  const handleMouseEnter = useCallback(() => {
    if (!soundOnRef.current) playMutedFromStart();
  }, [playMutedFromStart]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    if (!soundOnRef.current) pauseAndReset();
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
                // ⚠️ Do NOT add `muted` attribute here — it locks the element
                // at the browser DOM level and prevents JS from unmuting it.
                // Muting is controlled entirely via videoRef.current.muted in JS.
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

              {/* ══ MUTE/UNMUTE BUTTON — covers Gemini ✦ watermark ════════ */}

              <button
                onClick={handleMuteToggle}
                title={soundOn ? 'Mute video' : 'Unmute video'}
                style={{
                  position: 'absolute',
                  /* Gemini watermark sits at the very bottom-right corner of the video.
                     Position this button directly on top of it. */
                  bottom: '5%',
                  right: '2%',
                  zIndex: 8,
                  /* Large enough to fully cover the sparkle watermark */
                  width: 'clamp(36px, 11%, 52px)',
                  height: 'clamp(36px, 11%, 52px)',
                  borderRadius: '50%',
                  /* Apple-style dark glass */
                  background: 'radial-gradient(circle at 38% 30%, rgba(75,75,90,0.75) 0%, rgba(8,8,14,0.94) 72%)',
                  backdropFilter: 'blur(20px) saturate(1.8) brightness(0.85)',
                  WebkitBackdropFilter: 'blur(20px) saturate(1.8) brightness(0.85)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  boxShadow: [
                    'inset 0 1.5px 2.5px rgba(255,255,255,0.22)',
                    'inset 0 -1px 2px rgba(0,0,0,0.5)',
                    '0 4px 20px rgba(0,0,0,0.7)',
                    '0 1px 4px rgba(0,0,0,0.5)',
                  ].join(', '),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  padding: 0,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  /* reset browser button styles */
                  outline: 'none',
                  WebkitAppearance: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.12)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                onMouseUp={e => e.currentTarget.style.transform = 'scale(1.12)'}
              >
                {/* Top-left gloss shimmer */}
                <div style={{
                  position: 'absolute',
                  top: '-25%', left: '-10%',
                  width: '65%', height: '55%',
                  background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }} />

                {/* Icon: speaker with 2 waves (unmuted) OR muted X */}
                <svg
                  width="62%" height="62%"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ display: 'block', position: 'relative', zIndex: 1 }}
                >
                  {soundOn ? (
                    /* ── UNMUTED: speaker + sound waves ── */
                    <>
                      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="white" />
                      <path
                        d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"
                        fill="white"
                      />
                      <path
                        d="M19 12c0-3.53-2.04-6.58-5-8.05v2.2c1.84 1.32 3 3.41 3 5.85 0 2.44-1.16 4.53-3 5.85v2.2c2.96-1.47 5-4.52 5-8.05z"
                        fill="white"
                      />
                    </>
                  ) : (
                    /* ── MUTED: speaker + X lines ── */
                    <>
                      <path d="M3 9v6h4l5 5V4L7 9H3z" fill="rgba(255,255,255,0.9)" />
                      <line x1="23" y1="9" x2="17" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      <line x1="17" y1="9" x2="23" y2="15" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </button>
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
        {soundOn
          ? 'Click screen or 🔊 to mute · Playing with sound'
          : 'Hover to preview · Click to play with sound'}
      </p>
    </section>
  );
};

export default IntroVideo;
