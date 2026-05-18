import { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import useMousePosition from '../hooks/useMousePosition';
import hoverEffect from 'hover-effect';
/* ── Photo card data ─────────────────────────────────────────────────
   Replace src: null with your image path when ready.
   ─────────────────────────────────────────────────────────────────── */
const CARD_PHOTOS = [
  { id: 1, src: '/amar_speaking.webp', alt: 'Speaking at Event', color: '#1a1a2e' },
  { id: 2, src: '/photo2.webp', alt: 'Photo 2', color: '#0f2318' },
  { id: 3, src: '/chargegrid_ai_hero.webp', alt: 'ChargeGrid AI', color: '#1a0f2e' },
  { id: 4, src: '/drone_intelligence_ecosystem/screen.webp', alt: 'SkyGrid AI: Premium Food Delivery', color: '#2e1a0f' },
  { id: 5, src: '/medirescue_ai/screen.webp', alt: 'MediRescue AI: Emergency Response', color: '#0d1a1a' },
];

/* Each card's initial scattered position & rotation — exactly like photos tossed on a surface */
const CARD_INITIAL = [
  { x: -220, y: 60, rotate: -38, zIndex: 1 },
  { x: -110, y: 20, rotate: -18, zIndex: 2 },
  { x: 0, y: 0, rotate: 5, zIndex: 5 },
  { x: 120, y: 30, rotate: 20, zIndex: 3 },
  { x: 200, y: 70, rotate: 42, zIndex: 4 },
];

/* ─── Single draggable scattered photo card ─── */
const ScatterCard = ({ photo, initial, index, isInView }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(initial.zIndex);

  return (
    <motion.div
      drag
      dragMomentum={true}
      dragElastic={0.15}
      dragTransition={{ bounceStiffness: 80, bounceDamping: 14 }}
      onDragStart={() => { setIsDragging(true); setZIndex(20); }}
      onDragEnd={() => { setIsDragging(false); setZIndex(initial.zIndex); }}
      initial={{ x: initial.x, y: initial.y, rotate: 0, opacity: 0, scale: 0.6 }}
      animate={isInView
        ? { x: initial.x, y: initial.y, rotate: initial.rotate, opacity: 1, scale: 1 }
        : { x: initial.x, y: initial.y, rotate: 0, opacity: 0, scale: 0.6 }
      }
      transition={{
        opacity: { duration: 0.4, delay: index * 0.1 },
        scale: { type: 'spring', stiffness: 80, damping: 14, delay: index * 0.1 },
        rotate: { type: 'spring', stiffness: 60, damping: 12, delay: index * 0.1 },
        x: { type: 'spring', stiffness: 60, damping: 14, delay: index * 0.1 },
        y: { type: 'spring', stiffness: 60, damping: 14, delay: index * 0.1 },
      }}
      whileTap={{ scale: 1.06 }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-150px',
        marginLeft: '-110px',
        width: '220px',
        height: '300px',
        borderRadius: '22px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: isDragging
          ? '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.15)'
          : '0 16px 48px rgba(0,0,0,0.7)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex,
        willChange: 'transform',
        userSelect: 'none',
      }}
    >
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt}
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
        />
      ) : (
        <div style={{
          width: '100%', height: '100%',
          background: `linear-gradient(160deg, ${photo.color} 0%, #040406 100%)`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '10px',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
            <circle cx="8" cy="8.5" r="2" fill="rgba(255,255,255,0.22)" />
            <path d="M2 17l5.5-5.5 4 4 2.5-2.5 8 8" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{
            fontSize: '10.5px', color: 'rgba(255,255,255,0.18)',
            fontFamily: "'Outfit', sans-serif", letterSpacing: '0.08em',
          }}>{photo.alt}</span>
        </div>
      )}
      {/* Top-left gloss */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(140deg, rgba(255,255,255,0.06) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />
    </motion.div>
  );
};



/* ─── Scattered Cards Section ─── */
const ScatteredCardsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isSmallMobile = windowWidth < 480;

  // Scale positions for mobile
  const responsiveInitial = CARD_INITIAL.map(pos => ({
    ...pos,
    x: isSmallMobile ? pos.x * 0.4 : isMobile ? pos.x * 0.7 : pos.x,
    y: isSmallMobile ? pos.y * 0.4 : isMobile ? pos.y * 0.7 : pos.y,
  }));

  return (
    <div
      ref={sectionRef}
      style={{
        width: '100%',
        background: '#000',
        position: 'relative',
        zIndex: 5,
        padding: isMobile ? '40px 0 80px' : '80px 0 160px'
      }}
    >
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '0 clamp(20px, 5vw, 80px)',
        display: 'flex', alignItems: 'center',
        gap: 'clamp(40px, 6vw, 80px)', flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        {/* Left: Bio text */}
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -40, y: isMobile ? 20 : 0 }}
          animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ flex: '1 1 320px', maxWidth: isMobile ? '100%' : '480px' }}
        >
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(15px, 1.6vw, 18px)',
            lineHeight: 1.85,
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
          }}>
            Designing for real people and real impact. I've spent years
            bridging the gap between user needs and business goals, crafting
            digital experiences that feel intuitive and look stunning. Whether
            working on a startup's first product or refining complex
            design systems, my mission remains the same:{' '}
            <strong style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>
              removing friction from every interaction that matters.
            </strong>
          </p>
        </motion.div>

        {/* Right: Scattered draggable photo cards */}
        <div style={{
          flex: '1 1 420px',
          position: 'relative',
          height: isSmallMobile ? '280px' : isMobile ? '340px' : '420px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'visible',
          marginTop: isSmallMobile ? '120px' : isMobile ? '140px' : '0'
        }}>
          {/* Cards scattered around center */}
          {CARD_PHOTOS.map((photo, i) => (
            <ScatterCard
              key={photo.id}
              photo={photo}
              initial={responsiveInitial[i]}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Hero ─── */
const Hero = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [role, setRole] = useState("UI / UX Designer");
  const { x, y } = useMousePosition();
  const containerRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  useEffect(() => {
    const roles = ["UI / UX Designer", "Frontend developer", "Product Designer"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % roles.length;
      setRole(roles[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.dataset.initialized) return;
    containerRef.current.dataset.initialized = 'true';
    new hoverEffect({
      parent: containerRef.current,
      intensity: 0.3,
      image1: '/base-mask.webp',
      image2: '/amar_full_face_hair.webp',
      displacementImage: '/fluid.jpg',
      imagesRatio: 1.25,
    });
  }, []);

  return (
    <>
      <section
        id="hero"
        style={{
          position: 'relative', width: '100%', minHeight: '100vh',
          background: '#000', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
      >
        {/* Title */}
        <div style={{
          position: 'relative', zIndex: 10, textAlign: 'center',
          padding: 'clamp(100px, 14vh, 140px) 32px 0', pointerEvents: 'none',
        }}>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(38px, 5.5vw, 72px)',
            fontWeight: 400, color: '#ffffff', lineHeight: 1.1,
            margin: 0, letterSpacing: '-0.02em',
          }}>
            Hi, I&apos;m <strong style={{ fontWeight: 800 }}>Jaalthari Amarendar</strong>
          </h1>
          <AnimatePresence mode="wait">
            <motion.p
              key={role}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 'clamp(26px, 4.2vw, 48px)',
                fontWeight: 600, color: '#4f8ef7', marginTop: '10px', letterSpacing: '-0.01em',
              }}
            >
              {role}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* WebGL liquid image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        }}>
          <div
            ref={containerRef}
            onMouseEnter={() => { setIsHovering(true); setRevealed(true); }}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={() => { setIsHovering(true); setRevealed(true); }}
            onTouchEnd={() => setIsHovering(false)}
            style={{
              height: 'clamp(60vh, 85vh, 95vh)',
              width: 'calc(clamp(60vh, 85vh, 95vh) / 1.25)',
              maxWidth: '90vw', position: 'relative', cursor: isMobile ? 'default' : 'none',
            }}
          />

          <div style={{
            position: 'absolute', left: 'clamp(24px, 6vw, 100px)', top: '50%',
            transform: 'translateY(-50%)', zIndex: 5,
            border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: '6px',
            padding: '8px 14px', display: 'flex', alignItems: 'center',
            gap: '8px', pointerEvents: 'none',
            opacity: revealed ? 0 : 1,
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}>
            <span style={{
              fontSize: '13px', fontFamily: "'Outfit', monospace",
              color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em', fontWeight: 500,
            }}>{isMobile ? '[ Tap to reveal ]' : '[ Hover to reveal ]'}</span>
          </div>
        </div>

        {!isMobile && <MaskCursorRing x={x} y={y} isHovering={isHovering} />}

        {/* Scroll hint */}
        <div style={{
          position: 'absolute', bottom: '28px', left: '50%',
          transform: 'translateX(-50%)', zIndex: 10,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
        }}>
          <span style={{
            fontSize: '11px', color: 'rgba(255,255,255,0.25)',
            letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Outfit', sans-serif",
          }}>Scroll</span>
          <div style={{ width: '1px', height: '36px', background: 'linear-gradient(180deg, rgba(255,255,255,0.3), transparent)' }} />
        </div>
      </section>

      {/* Scattered draggable photo cards section */}
      <ScatteredCardsSection />
    </>
  );
};

/* ─── Large cursor ring ─── */
const MaskCursorRing = ({ x, y, isHovering }) => {
  const size = isHovering ? 150 : 64;
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, zIndex: 20, pointerEvents: 'none',
        border: `1.5px solid ${isHovering ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)'}`,
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isHovering ? 'rgba(255,255,255,0.05)' : 'transparent',
        backdropFilter: isHovering ? 'blur(4px)' : 'none',
        boxShadow: isHovering ? '0 0 30px rgba(255,255,255,0.05)' : 'none',
      }}
      animate={{ x: x - size / 2, y: y - size / 2, width: size, height: size }}
      transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.5 }}
    >
      {!isHovering && (
        <span style={{
          color: 'rgba(255,255,255,0.6)', fontSize: '10px', letterSpacing: '0.08em',
          fontFamily: "'Outfit', sans-serif", fontWeight: 500,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>hover</span>
      )}
      {isHovering && (
        <div style={{
          width: '4px', height: '4px', background: '#fff', borderRadius: '50%'
        }} />
      )}
    </motion.div>
  );
};

export default Hero;
