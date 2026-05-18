import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const experiences = [
  {
    id: 'exp-1',
    logo: <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '22px', letterSpacing: '-0.5px', color: 'rgba(255,255,255,0.9)' }}>Freelance</span>,
    date: '2023 – Present',
    role: 'UI/UX Designer',
    description: 'Designing end-to-end digital experiences for clients across e-commerce, healthcare, food delivery, and interior design. My focus is on turning complex requirements into clean, intuitive interfaces that drive real business results.'
  },
  {
    id: 'exp-2',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)' }}>
        <div style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, var(--accent-3), var(--accent))', borderRadius: '4px' }}></div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.3px' }}>Digital Yelender</span>
      </div>
    ),
    date: '2022 – 2023',
    role: 'Web Designer',
    description: 'Built and designed a full-featured clothing brand website. Developed a keen eye for conversion-focused layouts, clear visual hierarchy, and impactful brand storytelling across digital touchpoints.'
  },
  {
    id: 'exp-3',
    logo: (
      <div style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '4px' }}>
        <span style={{ fontFamily: 'sans-serif', fontWeight: 'bold', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Joe & Sera</span>
      </div>
    ),
    date: '2021 – 2022',
    role: 'Visual Designer',
    description: "Designed the complete brand identity and digital presence for a premium interior design studio. Crafted an immersive website experience that reflected the studio's high-end aesthetic and attracted their target clientele."
  }
];
const Experience = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeCardIndex, setActiveCardIndex] = useState(1); // Default to middle card
  const totalCards = experiences.length;
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isSmallMobile = windowWidth < 480;

  return (
    <section id="experience" className="section" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
      <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="section-label" style={{ margin: '0 auto 20px', background: 'rgba(255,255,255,0.06)', padding: '6px 16px', borderRadius: '99px', display: 'inline-block', color: 'var(--text-primary)' }}>
          Experience
        </div>
        <h2 className="section-title" style={{ marginBottom: '20px' }}>Designed for a smooth journey</h2>
        <p className="section-subtitle" style={{ maxWidth: '800px', margin: '0 auto clamp(40px, 8vh, 80px)', color: 'var(--text-secondary)' }}>
          From idea to execution, every project is a story of problem-solving, creativity, and craft. I've spent years bridging the gap between user needs and business goals, defining clear interaction patterns, and <strong style={{ color: "white" }}>turning complex requirements into clean interfaces.</strong>
        </p>

        <div className="experience-cards-container" style={isMobile ? {
            position: 'relative', 
            height: isSmallMobile ? '360px' : '420px', 
            width: '100%', 
            maxWidth: '480px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            overflow: 'visible',
         } : { 
            position: 'relative', 
            height: '420px', 
            width: '100%', 
            maxWidth: '1000px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
         }}>
          {experiences.map((exp, i) => {
            const cardWidth = isMobile 
              ? (isSmallMobile ? 260 : 300) 
              : (isSmallMobile ? 280 : 320);
            const cardHeight = isMobile 
              ? (isSmallMobile ? 240 : 270) 
              : (isSmallMobile ? 320 : 360);

            // Symmetrical offsets for exactly 3 cards
            const desktopStyles = [
              { rotation: -5, xOff: -200, yOff: 20  },  // Left fanned
              { rotation:  0, xOff: 0,    yOff: 0   },  // Middle fanned
              { rotation:  5, xOff: 200,  yOff: 20  },  // Right fanned
            ];

            const mobileStyles = [
              { rotation: -6, xOff: -8,  yOff: isSmallMobile ? -50 : -60 }, // Top overlapping card
              { rotation: 3,  xOff: 4,   yOff: 0 },                         // Middle card
              { rotation: -3, xOff: -4,  yOff: isSmallMobile ? 50 : 60 },   // Bottom overlapping card
            ];

            const baseStyle = isMobile ? mobileStyles[i] : desktopStyles[i];
            const { rotation, xOff, yOff } = baseStyle || { rotation: 0, xOff: 0, yOff: 0 };
            const defaultZIndex = 50 - Math.abs(i - 1) * 10; // Balanced around middle card (index 1)

            const isActive = isMobile ? (activeCardIndex === i) : (hoveredIndex === i);
            const activeRotation = isActive ? 0 : rotation;
            const activeY = isActive ? yOff : yOff;
            const activeX = xOff;
            const activeZ = isActive ? 200 : defaultZIndex;
            const activeScale = isActive ? (isMobile ? 1.05 : 1.08) : 1;

            return (
              <motion.div
                key={exp.id}
                className="journey-card"
                onHoverStart={() => { if (!isMobile) setHoveredIndex(i); }}
                onHoverEnd={() => { if (!isMobile) setHoveredIndex(null); }}
                onClick={() => { if (isMobile) setActiveCardIndex(i); }}
                animate={{
                  rotate: activeRotation,
                  x: activeX,
                  y: activeY,
                  scale: activeScale,
                  zIndex: activeZ,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  marginLeft: `-${cardWidth / 2}px`,
                  marginTop: `-${cardHeight / 2}px`,
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  background: 'linear-gradient(135deg, #1f1f1f, #141414)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: isSmallMobile ? '20px' : '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: isActive
                    ? '0 40px 80px -15px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)'
                    : '0 20px 40px -15px rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  willChange: 'transform',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginBottom: isSmallMobile ? '16px' : '24px', height: '32px' }}>
                  {exp.logo}
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isSmallMobile ? '18px' : '20px', fontWeight: '700', color: '#fff', marginBottom: '14px', letterSpacing: '-0.3px' }}>
                  {exp.role}
                </h3>
                
                <p style={{ fontSize: isSmallMobile ? '11.5px' : '12.5px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6', margin: 0, fontWeight: 400 }}>
                  {exp.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
