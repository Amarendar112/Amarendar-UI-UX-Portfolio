import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const IntroVideo = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [inView, setInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const tiltX = useSpring(useTransform(mouseY, [-350, 350], [8, -8]), { stiffness: 85, damping: 22 });
  const tiltY = useSpring(useTransform(mouseX, [-500, 500], [-10, 10]), { stiffness: 85, damping: 22 });
  const shadowX = useSpring(useTransform(mouseX, [-500, 500], [12, -12]), { stiffness: 85, damping: 22 });
  const glareX = useSpring(useTransform(mouseX, [-500, 500], [-30, 30]), { stiffness: 85, damping: 22 });
  const glareY = useSpring(useTransform(mouseY, [-350, 350], [-20, 20]), { stiffness: 85, damping: 22 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Sync muted state imperatively — React's `muted` prop doesn't update after mount
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (inView) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
      vid.currentTime = 0;
    }
  }, [inView]);

  const handleMouseMove = (e) => {
    if (!sectionRef.current) return;
    const r = sectionRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (r.left + r.width / 2));
    mouseY.set(e.clientY - (r.top + r.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleSound = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const vid = videoRef.current;
    if (!vid) return;
    if (isMuted) {
      vid.muted = false;
      vid.play().catch(() => {});
    } else {
      vid.muted = true;
    }
    setIsMuted(prev => !prev);
  };

  const tr = (d = 0) =>
    'opacity 0.9s ' + d + 's cubic-bezier(0.22,1,0.36,1), transform 0.9s ' + d + 's cubic-bezier(0.22,1,0.36,1)';
  const W = 'min(92vw, 860px)';

  return (
    <section
      ref={sectionRef}
      id="intro-video"
      onMouseMove={handleMouseMove}
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

        <motion.div
          animate={inView ? { y: [0, -14, 0] } : { y: 0 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'relative', width: '100%', zIndex: 2, transformStyle: 'preserve-3d' }}
        >
          <motion.div style={{
            position: 'relative', width: '100%', transformStyle: 'preserve-3d',
            rotateX: tiltX, rotateY: tiltY,
          }}>
            <img
              src="/phone_mockup_clean.png"
              alt="Phone Mockup"
              style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
            />

            <div
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
              }}
            >
              <video
                ref={videoRef}
                src="/intro_video.mp4"
                loop
                muted
                controls={false}
                playsInline
                preload="auto"
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                x-webkit-airplay="deny"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: 'center center',
                  display: 'block', pointerEvents: 'none',
                  transform: 'scale(1.08) translate(-0.5%, -0.5%)',
                }}
              />

              <div style={{
                position: 'absolute', left: '1.36%', top: '50%',
                transform: 'translateY(-50%)',
                width: '3.62%', height: '25.34%',
                background: '#000', borderRadius: '999px',
                zIndex: 3, boxShadow: '0 0 2px rgba(0,0,0,0.6)',
              }} />

              <button
                onClick={toggleSound}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                style={{
                  position: 'absolute',
                  bottom: isMobile ? '2px' : '6px',
                  right: isMobile ? '8px' : '14px',
                  width: isMobile ? '36px' : '50px',
                  height: isMobile ? '36px' : '50px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.28)',
                  background: 'rgba(0,0,0,0.72)',
                  backdropFilter: 'blur(6px)',
                  WebkitBackdropFilter: 'blur(6px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10,
                  padding: 0,
                  transition: 'background 0.2s ease, transform 0.15s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.75)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.55)'; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {!isMuted ? (
                  <svg width={isMobile ? 9 : 20} height={isMobile ? 9 : 20} viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/>
                    <path d="M15.54 8.46C16.48 9.4 17.05 10.65 17.05 12C17.05 13.35 16.48 14.6 15.54 15.54" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M19.07 4.93C20.94 6.8 22.01 9.33 22.01 12C22.01 14.67 20.94 17.2 19.07 19.07" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width={isMobile ? 9 : 20} height={isMobile ? 9 : 20} viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="white"/>
                    <line x1="23" y1="9" x2="17" y2="15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    <line x1="17" y1="9" x2="23" y2="15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                )}
              </button>

              <motion.div style={{
                position: 'absolute', inset: '-20%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 30%, transparent 60%, rgba(255,255,255,0.02) 100%)',
                pointerEvents: 'none', zIndex: 4, x: glareX, y: glareY,
              }} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <p style={{
        fontFamily: "'Outfit',sans-serif",
        fontSize: 'clamp(12px,1.1vw,14px)',
        color: 'rgba(255,255,255,0.22)',
        margin: '28px 0 0', letterSpacing: '0.03em', textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'none' : 'translateY(12px)',
        transition: tr(0.44),
      }}>
        {!isMuted
          ? String.fromCodePoint(0x1F50A) + ' Playing with sound · Click to mute'
          : 'Playing silently · Click to unmute'}
      </p>
    </section>
  );
};

export default IntroVideo;
