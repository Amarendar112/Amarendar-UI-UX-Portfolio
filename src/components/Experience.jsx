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
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Default to first card
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
            padding: '24px 20px 140px',
            marginTop: '20px',
            transformStyle: 'preserve-3d',
         } : { 
            position: 'relative', 
            height: '420px', 
            width: '100%', 
            maxWidth: '1000px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            transformStyle: 'preserve-3d',
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

            const mobileRotations = [4.5, -3, 3.5];
            const rotation = isMobile ? mobileRotations[i] : desktopStyles[i].rotation;
            const xOff = isMobile ? 0 : desktopStyles[i].xOff;
            const yOff = isMobile ? 0 : desktopStyles[i].yOff;

            const defaultZIndex = isMobile ? (experiences.length - i) : (50 - Math.abs(i - 1) * 10);

            // Calculate dynamic mobile Y-translation to spread cards apart when hovered/active
            let mobileY = 0;
            if (isMobile) {
              const active = activeCardIndex;
              const spacing = isSmallMobile ? 70 : 85;
              if (i < active) {
                // Cards above the active card shift UP
                mobileY = (i - active) * spacing;
              } else if (i > active) {
                // Cards below the active card shift DOWN
                mobileY = (i - active) * spacing + 30;
              } else {
                // Active card is slightly lifted
                mobileY = -5;
              }
            }

            const isActive = isMobile ? (activeCardIndex === i) : (hoveredIndex === i);
            const activeRotation = isActive ? 0 : rotation;
            
            const activeY = isMobile ? mobileY : (isActive ? yOff - 55 : yOff);
            const activeX = xOff;
            const activeZ = isActive ? (isMobile ? 10 : 200) : defaultZIndex;
            const activeScale = isMobile ? (isActive ? 1.02 : 0.96) : (isActive ? 1.08 : 1);
            const opacity = isMobile ? (isActive ? 1 : 0.55) : (hoveredIndex !== null ? (isActive ? 1 : 0.8) : 1);

            return (
              <motion.div
                key={exp.id}
                className="journey-card"
                onHoverStart={() => { 
                  setHoveredIndex(i); 
                  if (isMobile) setActiveCardIndex(i); 
                }}
                onHoverEnd={() => { 
                  setHoveredIndex(null); 
                }}
                onClick={() => { if (isMobile) setActiveCardIndex(i); }}
                animate={{
                  rotate: activeRotation,
                  x: activeX,
                  y: activeY,
                  scale: activeScale,
                  zIndex: activeZ,
                  opacity: opacity,
                  z: isActive ? 50 : 0,
                }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  left: isMobile ? 'auto' : '50%',
                  top: isMobile ? 'auto' : '50%',
                  zIndex: activeZ,
                  marginLeft: isMobile ? '0' : `-${cardWidth / 2}px`,
                  marginTop: isMobile 
                    ? (i === 0 ? '0px' : (isSmallMobile ? '-45px' : '-55px')) 
                    : `-${cardHeight / 2}px`,
                  width: isMobile ? '100%' : `${cardWidth}px`,
                  maxWidth: isMobile ? '350px' : undefined,
                  height: isMobile ? 'auto' : `${cardHeight}px`,
                  background: '#131415',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: isSmallMobile ? '24px 20px' : '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.65)',
                  cursor: 'pointer',
                  willChange: 'transform',
                  transformStyle: 'preserve-3d',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSmallMobile ? '20px' : '24px', height: '32px', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {exp.logo}
                  </div>
                  <div style={{ fontSize: isSmallMobile ? '12px' : '13px', color: 'rgba(255, 255, 255, 0.45)', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
                    {exp.date}
                  </div>
                </div>
                
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: isSmallMobile ? '19px' : '21px', fontWeight: '700', color: '#fff', marginBottom: '12px', letterSpacing: '-0.3px' }}>
                  {exp.role}
                </h3>
                
                <p style={{ fontSize: isSmallMobile ? '12.5px' : '13.5px', color: 'rgba(255, 255, 255, 0.6)', lineHeight: '1.65', margin: 0, fontWeight: 400, fontFamily: 'var(--font-body)' }}>
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
