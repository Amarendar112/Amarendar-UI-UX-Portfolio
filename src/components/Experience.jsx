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
            width: '100%', 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '24px 20px 60px',
            marginTop: '20px',
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
            const cardWidth = isSmallMobile ? 280 : 320;
            const cardHeight = isSmallMobile ? 320 : 360;

            // Symmetrical offsets for exactly 3 cards
            const desktopStyles = [
              { rotation: -5, xOff: -200, yOff: 20  },  // Left fanned
              { rotation:  0, xOff: 0,    yOff: 0   },  // Middle fanned
              { rotation:  5, xOff: 200,  yOff: 20  },  // Right fanned
            ];

            const mobileRotations = [-2.5, 2, -1.5];
            const rotation = isMobile ? mobileRotations[i] : desktopStyles[i].rotation;
            const xOff = isMobile ? 0 : desktopStyles[i].xOff;
            const yOff = isMobile ? 0 : desktopStyles[i].yOff;

            const defaultZIndex = isMobile ? (i + 1) : (50 - Math.abs(i - 1) * 10);

            const isActive = isMobile ? (activeCardIndex === i) : (hoveredIndex === i);
            const activeRotation = isActive ? 0 : rotation;
            const activeY = isActive ? (isMobile ? -25 : yOff - 55) : (isMobile ? 0 : yOff);
            const activeX = xOff;
            const activeZ = isActive ? 200 : defaultZIndex;
            const activeScale = isActive ? (isMobile ? 1.06 : 1.08) : 1;

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
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  left: isMobile ? 'auto' : '50%',
                  top: isMobile ? 'auto' : '50%',
                  zIndex: activeZ,
                  marginLeft: isMobile ? '0' : `-${cardWidth / 2}px`,
                  marginTop: isMobile 
                    ? (i === 0 ? '0px' : (isSmallMobile ? '-75px' : '-90px')) 
                    : `-${cardHeight / 2}px`,
                  width: isMobile ? '100%' : `${cardWidth}px`,
                  maxWidth: isMobile ? '340px' : undefined,
                  height: isMobile ? 'auto' : `${cardHeight}px`,
                  background: 'linear-gradient(135deg, #1f1f1f, #141414)',
                  border: isActive
                    ? '1px solid rgba(79, 142, 247, 0.45)'
                    : '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: isSmallMobile ? '20px' : '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: isActive
                    ? '0 30px 60px -15px rgba(0,0,0,0.85), 0 0 30px rgba(79, 142, 247, 0.15)'
                    : '0 15px 30px -10px rgba(0,0,0,0.6)',
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
