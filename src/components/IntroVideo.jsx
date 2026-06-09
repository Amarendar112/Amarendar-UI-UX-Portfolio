import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────
   IntroVideo – Sound system
   · Hover   → muted autoplay preview
   · Click   → unmute with audio fade-in (toggles mute/unmute)
   · The mute button covers the Gemini watermark at bottom-right
   ───────────────────────────────────────────────────────────────────────── */

const IntroVideo = () => {
  const sectionRef = useRef(null);
  const videoRef   = useRef(null);
  const fadeRaf    = useRef(null);

  const [inView,  setInView]  = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  // We use a ref to track mute state in callbacks without re-renders
  const isSoundOn = useRef(false);

  // ── Motion values ─────────────────────────────────────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX   = useSpring(useTransform(mouseY, [-350, 350], [8, -8]),   { stiffness: 85, damping: 22 });
  const tiltY   = useSpring(useTransform(mouseX, [-500, 500], [-10, 10]), { stiffness: 85, damping: 22 });
  const shadowX = useSpring(useTransform(mouseX, [-500, 500], [12, -12]), { stiffness: 85, damping: 22 });
  const glareX  = useSpring(useTransform(mouseX, [-500, 500], [-30, 30]), { stiffness: 85, damping: 22 });
  const glareY  = useSpring(useTransform(mouseY, [-350, 350], [-20, 20]), { stiffness: 85, damping: 22 });

  // ── Fade volume 0→1 ──────────────────────────────────────────────────────
  const fadeIn = useCallback((vid, ms = 800) => {
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    const t0 = performance.now();
    const tick = (now) => {
      if (!vid || vid.paused) return;
      const p = Math.min((now - t0) / ms, 1);
      try { vid.volume = p; } catch (_) { /* ignore */ }
      if (p < 1) fadeRaf.current = requestAnimationFrame(tick);
    };
    fadeRaf.current = requestAnimationFrame(tick);
  }, []);

  // ── Play muted from start (hover preview) ────────────────────────────────
  const playMuted = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    vid.muted       = true;
    vid.volume      = 0;
    vid.currentTime = 0;
    vid.play().catch(() => {});
  }, []);

  // ── Pause + reset ────────────────────────────────────────────────────────
  const stopAndReset = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
    vid.pause();
    vid.currentTime = 0;
    vid.muted       = true;
    vid.volume      = 0;
    isSoundOn.current = false;
    setSoundOn(false);
  }, []);

  // ── THE SINGLE CLICK HANDLER — toggles mute on/off ─────────────────────
  const toggleSound = useCallback((e) => {
    // Prevent any double-firing from button + parent
    e.stopPropagation();

    const vid = videoRef.current;
    if (!vid) { console.warn('[IntroVideo] no video ref'); return; }

    console.log('[IntroVideo] toggleSound called, current isSoundOn:', isSoundOn.current);
    console.log('[IntroVideo] vid.muted:', vid.muted, 'vid.volume:', vid.volume, 'vid.paused:', vid.paused);

    if (!isSoundOn.current) {
      // ──── UNMUTE ────────────────────────────────────────────────────
      // CRITICAL: All of these must be SYNCHRONOUS inside the click handler.
      // Browsers revoke audio permission if done in async callbacks.
      vid.muted  = false;
      vid.volume = 0;

      // Also remove the HTML attribute to be safe
      vid.removeAttribute('muted');

      console.log('[IntroVideo] Set muted=false, calling play()...');

      const p = vid.play();
      if (p && p.then) {
        p.then(() => {
          console.log('[IntroVideo] play() resolved! Starting fade-in...');
          fadeIn(vid, 800);
          isSoundOn.current = true;
          setSoundOn(true);
        }).catch((err) => {
          console.error('[IntroVideo] play() REJECTED:', err.message);
          vid.muted  = true;
          vid.volume = 0;
        });
      } else {
        console.log('[IntroVideo] play() returned undefined (old browser), assuming success');
        fadeIn(vid, 800);
        isSoundOn.current = true;
        setSoundOn(true);
      }
    } else {
      // ──── MUTE ──────────────────────────────────────────────────────
      console.log('[IntroVideo] Muting...');
      if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current);
      vid.volume = 0;
      vid.muted  = true;
      isSoundOn.current = false;
      setSoundOn(false);
      // Keep playing (muted preview), don't pause
    }
  }, [fadeIn]);

  // ── Intersection Observer ─────────────────────────────────────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (!entry.isIntersecting) stopAndReset();
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [stopAndReset]);

  useEffect(() => () => { if (fadeRaf.current) cancelAnimationFrame(fadeRaf.current); }, []);

  // ── Mouse handlers ────────────────────────────────────────────────────────
  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (r.left + r.width / 2));
    mouseY.set(e.clientY - (r.top + r.height / 2));
  };

  const handleMouseEnter = useCallback(() => {
    if (!isSoundOn.current) playMuted();
  }, [playMuted]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    if (!isSoundOn.current) stopAndReset();
  }, [stopAndReset]);

  // ── Styling ───────────────────────────────────────────────────────────────
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

      {/* ══ Phone mockup ══════════════════════════════════════════════════ */}
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

            {/* Screen container — click anywhere on screen to toggle sound */}
            <div
              onClick={toggleSound}
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
              {/* VIDEO — muted attribute REQUIRED for autoplay policy.
                  We remove it via vid.removeAttribute('muted') on click to unmute. */}
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
          ? '🔊 Playing with sound · Click to mute'
          : 'Hover to preview · Click to unmute'}
      </p>
    </section>
  );
};

export default IntroVideo;
