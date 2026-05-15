import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────
   Spotify Card
───────────────────────────────────────── */
const SpotifyCard = ({ track, artist, albumColor, rotation, scale = 1, link, embedType = 'track' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const spotifyId = link ? link.split('/').pop() : null;
  const embedUrl = spotifyId
    ? `https://open.spotify.com/embed/${embedType}/${spotifyId}?utm_source=generator&theme=0&autoplay=1`
    : null;

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(prev => !prev);
  };

  return (
    <div
      style={{
        background: '#111',
        border: `1px solid ${isPlaying ? 'rgba(29,185,84,0.5)' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: '16px',
        padding: '12px 14px',
        width: '240px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transform: `rotate(${rotation}deg) scale(${scale})`,
        boxShadow: isPlaying
          ? '0 8px 32px rgba(29,185,84,0.25), 0 8px 32px rgba(0,0,0,0.6)'
          : '0 8px 32px rgba(0,0,0,0.6)',
        userSelect: 'none',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '8px', background: albumColor, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
            🎵
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{track}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{artist}</div>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1DB954">
          <path d="M12 0C5.37 0 0 5.373 0 12s5.37 12 12 12 12-5.373 12-12S18.63 0 12 0zm5.52 17.28c-.24.36-.66.48-1.02.24-2.82-1.74-6.36-2.1-10.56-1.14-.42.12-.84-.18-.96-.6-.12-.42.18-.84.6-.96 4.56-1.02 8.52-.6 11.64 1.32.42.24.54.72.3 1.14zm1.44-3.3c-.3.42-.84.54-1.26.24-3.24-1.98-8.16-2.58-11.94-1.38-.48.12-.96-.12-1.08-.6s.12-.96.6-1.08c4.38-1.32 9.78-.66 13.44 1.62.36.24.54.78.24 1.2zm.12-3.36c-3.84-2.28-10.2-2.52-13.86-1.38-.6.18-1.2-.18-1.38-.78-.18-.6.18-1.2.78-1.38 4.2-1.26 11.22-1.02 15.66 1.62.54.3.72 1.02.42 1.56-.3.48-1.02.66-1.56.36h-.06z" />
        </svg>
      </a>

      <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '99px', height: '3px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '38%', background: isPlaying ? '#1DB954' : '#fff', borderRadius: '99px', transition: 'background 0.3s ease' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '10px', background: isPlaying ? 'rgba(29,185,84,0.15)' : 'rgba(255,255,255,0.1)', color: isPlaying ? '#1DB954' : 'rgba(255,255,255,0.6)', borderRadius: '4px', padding: '3px 7px', fontFamily: 'Inter, sans-serif', transition: 'all 0.3s ease' }}>
          {isPlaying ? '▶ Playing' : 'Preview'}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
          <div
            onClick={handlePlayClick}
            style={{ width: '28px', height: '28px', borderRadius: '50%', background: isPlaying ? '#1DB954' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s ease, transform 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#000"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#000"><path d="M8 5v14l11-7z" /></svg>
            )}
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M18 6v12h-2V6zm-3.5 6L6 6v12z" /></svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><circle cx="5" cy="12" r="2" /></svg>
        </div>
      </div>

      <div style={{ borderRadius: '10px', overflow: 'hidden', marginTop: '-4px', display: isPlaying ? 'block' : 'none' }}>
        <iframe src={embedUrl} width="100%" height="80" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="eager" style={{ display: 'block', borderRadius: '10px' }} />
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Image Card
───────────────────────────────────────── */
const ImageCard = ({ src, label, rotation, width = 160, height = 140, fit = 'cover' }) => (
  <div
    style={{
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: '14px',
      background: '#1a1a1a',
      border: '3px solid rgba(255,255,255,0.08)',
      transform: `rotate(${rotation}deg)`,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      userSelect: 'none',
      position: 'relative',
    }}
  >
    <img src={src} alt={label} draggable="false" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: fit, opacity: 1, pointerEvents: 'none' }} />
    {label && (
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', fontSize: '11px', color: '#fff', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
        {label}
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────
   Positioned Draggable Card
───────────────────────────────────────── */
const PositionedCard = ({ children, style, zIndex, onDragStart }) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{
        position: 'absolute',
        zIndex: isDragging ? 200 : zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
        ...style,
      }}
      onDragStart={() => { setIsDragging(true); onDragStart?.(); }}
      onDragEnd={() => setIsDragging(false)}
      whileDrag={{ scale: 1.04 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Main BeyondPixels Section
───────────────────────────────────────── */
const BeyondPixels = () => {
  const [hint, setHint] = useState(true);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFirstDrag = useCallback(() => setHint(false), []);

  const isMobile = windowWidth < 768;
  const isSmall = windowWidth < 480;

  // Responsive card sizing
  const imgW  = isSmall ? 95  : isMobile ? 115 : 160;
  const imgH  = isSmall ? 85  : isMobile ? 105 : 145;
  const bigW  = isSmall ? 120 : isMobile ? 145 : 210;
  bigW; // suppress lint
  const bigH  = isSmall ? 120 : isMobile ? 145 : 210;
  bigH;
  const sp    = isSmall ? 0.62 : isMobile ? 0.74 : 1;

  return (
    <section
      id="instagram"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: isSmall ? '660px' : isMobile ? '700px' : '680px',
        background: '#080808',
        overflow: 'hidden',
      }}
    >
      {/* Dot-grid background */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none', zIndex: 0 }} />

      {/* ── CARDS: each pinned to a corner/edge relative to the section ── */}

      {/* TOP-LEFT: F1 passion */}
      <PositionedCard style={{ top: isMobile ? '3%' : '5%', left: isMobile ? '1%' : '1%' }} zIndex={10} onDragStart={handleFirstDrag}>
        <ImageCard src="/f1_passion.png" label="F1 passion" rotation={-6} width={imgW} height={imgH} />
      </PositionedCard>

      {/* LEFT-UPPER: UX Day */}
      <PositionedCard style={{ top: isMobile ? '26%' : '20%', left: isMobile ? '1%' : '4%' }} zIndex={11} onDragStart={handleFirstDrag}>
        <ImageCard src="/ux_day.png" label="ux day" rotation={4}
          width={isSmall ? 88 : isMobile ? 105 : 138}
          height={isSmall ? 72 : isMobile ? 88 : 112} />
      </PositionedCard>

      {/* LEFT-MID: Frame boy illustration */}
      <PositionedCard style={{ top: '48%', left: isMobile ? '-2%' : '0%' }} zIndex={12} onDragStart={handleFirstDrag}>
        <ImageCard src="/frame_boy_2.png" rotation={-5}
          width={isSmall ? 118 : isMobile ? 142 : 205}
          height={isSmall ? 118 : isMobile ? 142 : 205} fit="cover" />
      </PositionedCard>

      {/* BOTTOM-LEFT: Yimmy Yimmy */}
      <PositionedCard style={{ bottom: isMobile ? '2%' : '4%', left: isMobile ? '1%' : '4%' }} zIndex={13} onDragStart={handleFirstDrag}>
        <SpotifyCard track="Yimmy Yimmy" artist="Tayc, Shreya Ghoshal"
          albumColor="linear-gradient(135deg,#ff8c00,#ff4500)"
          rotation={3} scale={sp}
          link="https://open.spotify.com/track/08GYLNhKthS3arMdXsveRI" />
      </PositionedCard>

      {/* TOP-CENTER-LEFT: Popular Tracks */}
      <PositionedCard style={{ top: isMobile ? '2%' : '3%', left: isMobile ? '26%' : '20%' }} zIndex={14} onDragStart={handleFirstDrag}>
        <SpotifyCard track="Popular Tracks" artist="Shreya Ghoshal"
          albumColor="linear-gradient(135deg,#ec4899,#db2777)"
          rotation={-4} scale={sp}
          link="https://open.spotify.com/artist/5KmFbbptaZhEtmMibvibUE"
          embedType="artist" />
      </PositionedCard>

      {/* TOP-CENTER: Convocation */}
      <PositionedCard style={{ top: isMobile ? '2%' : '2%', left: '50%', marginLeft: isMobile ? `-${(imgW+10)/2}px` : `-${(imgW+10)/2}px` }} zIndex={15} onDragStart={handleFirstDrag}>
        <ImageCard src="/convocation.jpg" label="Convocation ceremony" rotation={-4} width={imgW + 10} height={imgH + 15} />
      </PositionedCard>

      {/* TOP-CENTER-RIGHT: Cheques */}
      <PositionedCard style={{ top: isMobile ? '2%' : '4%', right: isMobile ? '2%' : '14%' }} zIndex={16} onDragStart={handleFirstDrag}>
        <SpotifyCard track="Cheques" artist="Shubh"
          albumColor="linear-gradient(135deg,#1e3c72,#2a5298)"
          rotation={5} scale={sp}
          link="https://open.spotify.com/track/0H2LYJrPFMEr5JmdNBSwUd" />
      </PositionedCard>

      {/* TOP-RIGHT: Hobbies */}
      <PositionedCard style={{ top: isMobile ? '26%' : '8%', right: isMobile ? '0%' : '0%' }} zIndex={17} onDragStart={handleFirstDrag}>
        <ImageCard src="/hobbies.png" label="Hobbies" rotation={5}
          width={imgW + 22} height={imgH + 18} />
      </PositionedCard>

      {/* BOTTOM-CENTER: Speaking session */}
      <PositionedCard style={{ bottom: isMobile ? '2%' : '3%', left: '50%', marginLeft: isMobile ? `-${imgW/2}px` : `-${imgW/2}px` }} zIndex={18} onDragStart={handleFirstDrag}>
        <ImageCard src="/amar_speaking.png" label="Speaking session" rotation={-3} width={imgW} height={imgH + 35} />
      </PositionedCard>

      {/* BOTTOM-RIGHT: Anurag University */}
      <PositionedCard style={{ bottom: isMobile ? '2%' : '4%', right: isMobile ? '1%' : '3%' }} zIndex={19} onDragStart={handleFirstDrag}>
        <ImageCard src="/anurag_university.jpeg" label="Anurag university" rotation={-8}
          width={imgW + 12} height={imgH + 12} />
      </PositionedCard>

      {/* ── CENTER TEXT — always on top (z:100) ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', textAlign: 'center', padding: '0 20px' }}>

        {/* Soft radial backdrop behind text so cards don't obscure it */}
        <div style={{ position: 'absolute', width: isSmall ? '270px' : isMobile ? '330px' : '520px', height: isSmall ? '210px' : isMobile ? '250px' : '360px', background: 'radial-gradient(ellipse, rgba(8,8,8,0.9) 25%, transparent 75%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* "Connect on" cursive */}
          <div style={{ fontFamily: "'Dancing Script', 'Brush Script MT', cursive", fontSize: isSmall ? '20px' : isMobile ? '24px' : 'clamp(24px, 3.2vw, 36px)', color: 'rgba(255,255,255,0.78)', letterSpacing: '0.02em', marginBottom: '-6px', lineHeight: 1 }}>
            Connect on
          </div>

          {/* "Instagram" bold */}
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: isSmall ? '50px' : isMobile ? '62px' : 'clamp(58px, 7.5vw, 96px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1, margin: '4px 0 12px', whiteSpace: 'nowrap' }}>
            Instagram
            <span style={{ display: 'inline-block', width: isSmall ? '8px' : '10px', height: isSmall ? '8px' : '10px', borderRadius: '50%', background: '#7c6aff', marginLeft: '6px', verticalAlign: 'super', boxShadow: '0 0 12px #7c6aff' }} />
          </h2>

          {/* Drag hint */}
          {hint && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'Inter, sans-serif', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '99px', padding: '4px 12px', background: 'rgba(255,255,255,0.04)', marginBottom: '14px' }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M12 12v.01" />
              </svg>
              Drag cards to move
            </motion.div>
          )}

          {/* Subtitle */}
          <p style={{ fontSize: isSmall ? '12px' : isMobile ? '13px' : 'clamp(13px, 1.4vw, 15px)', color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif', maxWidth: '360px', lineHeight: 1.6, marginBottom: '22px' }}>
            My digital sketchbook. A space for unfinished thoughts and late-night experiments.
          </p>

          {/* Follow me button */}
          <a
            href="https://www.instagram.com/jaalthariamarendar"
            target="_blank"
            rel="noopener noreferrer"
            style={{ pointerEvents: 'all', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: isSmall ? '10px 20px' : '12px 28px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', color: '#fff', fontSize: isSmall ? '13px' : '14px', fontWeight: 600, fontFamily: "'Outfit', sans-serif", textDecoration: 'none', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Follow me
          </a>
        </div>
      </div>
    </section>
  );
};

export default BeyondPixels;
