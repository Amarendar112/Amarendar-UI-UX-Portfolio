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
    description: 'Built and designed full-featured agency websites and client projects. Developed a keen eye for conversion-focused layouts, clear visual hierarchy, and impactful brand storytelling across digital touchpoints.'
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
  },
  {
    id: 'exp-4',
    logo: <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '15px', letterSpacing: '1px', color: 'rgba(255,255,255,0.9)', textTransform: 'uppercase' }}>Apparel&Co.</span>,
    date: '2020 – 2021',
    role: 'Graphic & Shirt Designer',
    description: 'Created stylish, trendy graphic and apparel designs. Developed a strong foundation in color theory, typography, and layout, skills that now inform every UI decision I make.'
  }
];
const Experience = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
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

        <div className="experience-cards-container" style={{ 
            position: 'relative', 
            height: isMobile ? '480px' : '420px', 
            width: '100%', 
            maxWidth: '1000px', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px'
         }}>
          {experiences.map((exp, i) => {
            const centerIndex = (totalCards - 1) / 2;
            
            // Handcrafted messy positions — natural scattered look
            const cardStyles = [
              { rotation: -8,  xOff: -360, yOff: 30  },  // far left
              { rotation: -4,  xOff: -185, yOff: 10  },  // mid left
              { rotation:  1,  xOff:   0,  yOff: 0   },  // center
              { rotation:  6,  xOff:  185, yOff: 20  },  // mid right
              { rotation:  11, xOff:  360, yOff: 40  },  // far right
            ];

            const mobileStyles = [
                { rotation: -6, xOff: 0, yOff: -60 },
                { rotation: -3, xOff: 0, yOff: -30 },
                { rotation: 0, xOff: 0, yOff: 0 },
                { rotation: 3, xOff: 0, yOff: 30 },
                { rotation: 6, xOff: 0, yOff: 60 }
            ];

            const baseStyle = isMobile ? mobileStyles[i] : cardStyles[i];
            const { rotation, xOff, yOff } = baseStyle || { rotation: 0, xOff: 0, yOff: 0 };
            const defaultZIndex = 50 - Math.abs(i - 2) * 10;

            const isHovered = hoveredIndex === i;
            const activeRotation = hoveredIndex !== null ? (isHovered ? 0 : rotation * 1.15) : rotation;
            const activeY = isHovered ? yOff - (isMobile ? 20 : 55) : yOff;
            const activeX = xOff;
            const activeZ = isHovered ? 200 : defaultZIndex;
            const activeScale = isHovered ? (isMobile ? 1.05 : 1.08) : 1;

            return (
              <motion.div
                key={exp.id}
                className="journey-card"
                onHoverStart={() => setHoveredIndex(i)}
                onHoverEnd={() => setHoveredIndex(null)}
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
                  width: isSmallMobile ? '280px' : '320px',
                  height: isSmallMobile ? '320px' : '360px', 
                  background: 'linear-gradient(135deg, #1f1f1f, #141414)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  padding: isSmallMobile ? '20px' : '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  boxShadow: '0 30px 60px -15px rgba(0,0,0,0.7)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isSmallMobile ? '16px' : '24px', height: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {exp.logo}
                  </div>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '500', marginTop: '4px' }}>
                    {exp.date}
                  </span>
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
