import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
   IntroVideo — Pure CSS phone frame (no PNG, no artifacts)
   Matches the Desert Titanium orange/copper frame from the mockup exactly.
   ───────────────────────────────────────────────────────────────────────── */

const IntroVideo = () => {
  const sectionRef = useRef(null);
  const videoRef   = useRef(null);

  const [inView,  setInView]  = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          const vid = videoRef.current;
          if (!vid) return;
          vid.muted = true;
          vid.loop  = true;
          vid.play().catch(() => {});
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleClick = () => {
    const vid = videoRef.current;
    if (!vid) return;
    if (!soundOn) {
      vid.muted  = false;
      vid.volume = 1;
      vid.play().catch(() => {});
      setSoundOn(true);
    } else {
      vid.paused ? vid.play().catch(() => {}) : vid.pause();
    }
  };

  const tr = (d = 0) =>
    `opacity 0.9s ${d}s cubic-bezier(0.22,1,0.36,1), transform 0.9s ${d}s cubic-bezier(0.22,1,0.36,1)`;

  /* ── Phone dimensions ── */
  const W = 'min(92vw, 860px)';          // phone outer width
  const FRAME = 'min(1.8vw, 14px)';      // orange frame thickness
  const OUTER_R = 'min(7vw, 58px)';      // outer corner radius
  const INNER_R = 'min(6vw, 48px)';      // screen corner radius

  /* ── Desert Titanium copper gradient ── */
  const copperGrad = `
    linear-gradient(
      170deg,
      #e8924a 0%,
      #c8681a 18%,
      #9e4a0a 35%,
      #c97530 52%,
      #b8590e 68%,
      #e09040 82%,
      #c06820 100%
    )
  `;

  return (
    <section
      ref={sectionRef}
      id="intro-video"
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
        <span style={{ color: 'rgba(255,255,255,0.35)', display: 'block' }}>
          In Motion
        </span>
      </h2>

      {/* ══ Phone mockup wrapper ══════════════════════════════════════════ */}
      <div
        onClick={handleClick}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView
            ? 'scale(1) translateY(0) perspective(1200px) rotateY(0deg)'
            : 'scale(0.85) translateY(48px)',
          transition: tr(0.14),
          position: 'relative',
          width: W,
          marginTop: '-21.5%',  /* Crop the empty transparent padding vertically */
          marginBottom: '-21.5%',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Mockup PNG Image */}
        <img
          src="/phone_mockup_clean.png"
          alt="Phone Mockup"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            pointerEvents: 'none',
          }}
        />

        {/* Video Screen container — positioned exactly over the mockup screen */}
        <div style={{
          position: 'absolute',
          left: '6.84%',
          top: '28.81%',
          width: '86.33%',
          height: '42.38%',
          borderRadius: '4.8% / 9.8%', /* Matches the mockup screen corner radius exactly */
          overflow: 'hidden',
          background: '#000',
          zIndex: 2,
        }}>
          {/* Video element */}
          <video
            ref={videoRef}
            src="/intro_video.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              display: 'block',
              pointerEvents: 'none',
              transform: 'scale(1.08) translate(-0.5%, -0.5%)', /* Scale and shift to hide watermark in the rounded corner clip */
            }}
          />

          {/* Dynamic Island overlay */}
          <div style={{
            position: 'absolute',
            left: '1.36%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3.62%',
            height: '25.34%',
            background: '#000',
            borderRadius: '999px',
            zIndex: 3,
            boxShadow: '0 0 2px rgba(0,0,0,0.6)',
          }} />

          {/* Subtle glass reflection on screen */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, transparent 40%)',
            pointerEvents: 'none',
            zIndex: 4,
          }} />

          {/* Muted icon */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            zIndex: 5,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: soundOn ? 0 : (inView ? 1 : 0),
            transition: 'opacity 0.5s',
            pointerEvents: 'none',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M11 5L6 9H2v6h4l5 4V5z" fill="rgba(255,255,255,0.85)"/>
              <line x1="22" y1="9" x2="16" y2="15" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
              <line x1="16" y1="9" x2="22" y2="15" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

      </div>{/* /phone wrapper */}

      {/* Caption */}
      <p style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: 'clamp(12px,1.1vw,14px)',
        color: 'rgba(255,255,255,0.22)',
        margin: '28px 0 0',
        letterSpacing: '0.03em',
        textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(12px)',
        transition: tr(0.44),
      }}>
        Click to unmute · A glimpse into how I work
      </p>

    </section>
  );
};

export default IntroVideo;
