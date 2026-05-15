import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import trenzlyImg from '../assets/trenzly-preview.png';
import joeSeraImg from '../assets/joe-sera-preview.png';
import zomatoImg from '../assets/zomato-redesign-preview.png';
import quickslicesImg from '../assets/foodooze-preview.png';
import doctorUiImg from '../assets/doctor-ui-preview.png';
import dengueImg from '../assets/dengue-detection-preview.png';

const projects = [
  {
    id: 'trenzly',
    title: 'Trenzly',
    description:
      'A modern, fast, and customer-friendly e-commerce experience. Delivered a clean interface that boosted engagement and drove measurable sales growth for the client.',
    link: 'https://digitalyelender.com/',
    linkLabel: 'View Website',
    image: trenzlyImg,
    tag: 'E-Commerce',
  },
  {
    id: 'joe-sera',
    title: 'Joe & Sera — Interior Design Studio',
    description:
      'A premium website for an interior design studio. Crafted an immersive digital experience that feels premium and smooth — directly reflecting the studio\'s high-end brand.',
    link: 'https://joeandsera.com/',
    linkLabel: 'View Website',
    image: joeSeraImg,
    tag: 'Web Design',
  },
  {
    id: 'dengue-detection',
    title: 'Ai dengue detection using cbc data with decision tree algorithm.',
    description:
      'An AI-powered dengue detection system using CBC data and Decision Tree algorithms to predict positive or negative dengue cases with fast and accurate analysis',
    link: 'https://dengue-detection-ai.onrender.com',
    linkLabel: 'View Website',
    image: dengueImg,
    tag: 'AI & Healthcare',
  },
  {
    id: 'quickslices-pizza-app',
    title: 'Quickslices Pizza App',
    description:
      'Quickslice — Order fresh, hot pizza and get it delivered fast with just a few taps.',
    link: 'https://www.behance.net/gallery/218576355/Food-delivery/modules/1245613437',
    linkLabel: 'View Design',
    image: quickslicesImg,
    tag: 'App Design',
  },
  {
    id: 'doctor-ui',
    title: 'Healthcare — Doctor UI',
    description:
      'Empowering healthcare with innovative and accessible interface design. The system prioritis trust and clarity to connect patients and doctors digitally.',
    link: 'https://www.behance.net/gallery/208451819/Empowering-Healthcare-Innovative-Doctor-UI-Design/modules/1184015719',
    linkLabel: 'View Design',
    image: doctorUiImg,
    tag: 'UI Design',
  },
  {
    id: 'zomato-redesign',
    title: 'Zomato Redesign',
    description:
      'A complete UX redesign of the Zomato mobile app — reimagining the discovery and ordering flow to reduce friction and increase user delight at every touchpoint.',
    link: 'https://www.behance.net/gallery/244240063/Zomato-Redesign',
    linkLabel: 'View Design',
    image: zomatoImg,
    tag: 'UX Design',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  }),
};

/* ── 3D Tilt Card (The First Animation Style) ────────── */
const TiltCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    
    // Tilt calculation (±10deg)
    const rotY = (dx / (rect.width / 2)) * 10;
    const rotX = -(dy / (rect.height / 2)) * 10;

    // Spotlight calculation (%)
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    setTilt({ x: rotX, y: rotY });
    setSpotlight({ x: px, y: py });
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
    setSpotlight({ x: 50, y: 50 });
  };

  const cardStyle = {
    transform: hovered
      ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: hovered 
      ? 'transform 0.1s ease-out' 
      : 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    willChange: 'transform',
    transformStyle: 'preserve-3d',
  };

  const spotlightStyle = {
    opacity: hovered ? 1 : 0,
    background: `radial-gradient(circle 200px at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.1) 0%, transparent 80%)`,
    transition: 'opacity 0.3s ease',
  };

  return (
    <motion.div
      key={project.id}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={cardVariants}
      className={`project-card ${hovered ? 'is-hovered' : ''}`}
      ref={cardRef}
      style={cardStyle}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare/Spotlight Layer */}
      <div className="project-card__spotlight" style={spotlightStyle} />

      {/* Image Preview */}
      <div
        className="project-card__image-placeholder"
        style={
          project.image
            ? { background: '#000', marginTop: '-1px' }
            : { background: project.bg, marginTop: '-1px' }
        }
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`${project.title} preview`}
            style={{
              width: '100%',
              height: 'calc(100% + 2px)',
              objectFit: 'cover',
              objectPosition: 'top',
              display: 'block',
              marginTop: '-1px',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.04) translateZ(20px)' : 'scale(1) translateZ(0)',
            }}
          />
        ) : (
          <span style={{ fontSize: '52px' }}>{project.emoji}</span>
        )}
      </div>

      <div className="project-card__body" style={{ transform: 'translateZ(30px)' }}>
        <div className="project-card__header">
          <h3 className="project-card__title">{project.title}</h3>
          <span className="chip" style={{ fontSize: '11px', padding: '3px 9px' }}>
            {project.tag}
          </span>
        </div>
        <p className="project-card__desc">{project.description}</p>
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__link"
        >
          {project.linkLabel}
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-label">Projects</div>
        <h2 className="section-title">Projects you need to see</h2>
        <p className="section-subtitle">
          Turning ideas into stunning digital experiences with creativity and precision.
        </p>
        <p className="section-note">
          Let&apos;s turn your ideas into reality.{' '}
          <a href="https://wa.me/916305648641?text=Hi" target="_blank" rel="noopener noreferrer">
            Drop me a message
          </a>{' '}
          and let&apos;s collaborate.
        </p>

        <div className="projects-grid">
          {projects.map((project, i) => (
            <TiltCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
