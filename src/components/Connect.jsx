import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

const chatFaqs = [
  {
    id: 'faq-1',
    q: 'Can design really change how people use technology?',
    a: "Absolutely. I focus on creating interfaces that feel simple, intuitive, and visually engaging. Good UX removes confusion and improves user experience naturally.",
    emoji: { icon: '💖', top: '-10px', right: '40px', delay: 0 },
  },
  {
    id: 'faq-2',
    q: "What kind of products do you design?",
    a: "I enjoy designing AI-driven healthcare projects, mobile apps, and modern web experiences with strong visual storytelling and smooth interactions.",
  },
  {
    id: 'faq-3',
    q: 'What makes your work different?',
    a: "I combine UI/UX design with technical understanding in Python Full Stack and AI systems, which helps me create designs that are both creative and practical.",
  },
  {
    id: 'faq-4',
    q: 'Why combine design with technical skills?',
    a: "Because understanding both design and development helps me build realistic, scalable, and developer-friendly product experiences.",
    emoji: { icon: '⭐', top: '50%', left: '-18px', transform: 'translateY(-50%)', delay: 0 }
  },
];

const ChatItem = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="chat-item">
      {item.emoji && (
        <motion.div 
          className="chat-emoji"
          style={{ top: item.emoji.top, right: item.emoji.right, left: item.emoji.left }}
          animate={
            item.emoji.transform 
              ? { y: [0, -4, 0], transform: item.emoji.transform } 
              : { y: [0, -6, 0] }
          }
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: item.emoji.delay }}
        >
          {item.emoji.icon}
        </motion.div>
      )}
      <div className="chat-question" onClick={() => setIsOpen(!isOpen)}>
        <p>{item.q}</p>
        <div className="chat-toggle">
          {isOpen ? <Minus size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
            className="chat-answer-container"
          >
            <div className="chat-answer">
              <p>{item.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Connect = () => {
  return (
    <section id="connect" className="new-connect">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="connect-title">Start a Conversation</h2>
        <p className="connect-subtitle">
          No gatekeepers here just open channels. Whether you want to discuss the future of Agentic AI, book a career strategy session, or simply critique my latest playlist, I'm always up for a chat.
        </p>

        <div className="connect-action-btns">
          <a href="https://www.linkedin.com/in/amarendar-jaalthari-uiux-designer/" target="_blank" rel="noreferrer" className="connect-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            LinkedIn
          </a>
          <a href="mailto:jaalthariamarendar@gmail.com" className="connect-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Email
          </a>
          <a href="https://wa.me/916305648641" target="_blank" rel="noreferrer" className="connect-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.52 3.48a11.94 11.94 0 00-16.97 0c-4.66 4.66-4.66 12.23 0 16.9l-1.4 5.12 5.2-1.38a11.94 11.94 0 0016.97-16.94z" />
              <path d="M16.5 7.5l-7 7" />
              <path d="M9.5 13.5l-2 2" />
            </svg>
            WhatsApp
          </a>
          <a href="https://github.com/jaalthariamarendar" target="_blank" rel="noreferrer" className="connect-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.166 6.84 9.49.5.09.68-.22.68-.48v-1.71c-2.78.61-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.61.07-.6.07-.6 1 .07 1.53 1.02 1.53 1.02.9 1.53 2.36 1.09 2.94.84.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.02-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.76 1.02a9.55 9.55 0 012.5-.34c.85.004 1.71.115 2.5.34 1.92-1.29 2.76-1.02 2.76-1.02.55 1.38.2 2.4.1 2.65.63.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.7-4.58 4.95.36.31.68.92.68 1.86v2.76c0 .26.18.58.68.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" />
            </svg>
            GitHub
          </a>
          <a href="https://behance.net/jaalthariamarendar" target="_blank" rel="noreferrer" className="connect-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6h20v12H2z" />
              <path d="M22 6l-10 7L2 6" />
            </svg>
            Behance
          </a>
        </div>
      </div>

      <div className="container connect-main-grid">
        <div className="chat-interface">
          {chatFaqs.map(item => (
            <ChatItem key={item.id} item={item} />
          ))}
        </div>
        <div className="connect-visual">
          <div className="accent-gradient-frame">
            <div className="accent-gradient-frame-inner">
              <img 
                src="/convocation.jpg" 
                alt="Connect" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </div>
          </div>
          <div className="frame-caption">
            <h4 className="frame-caption__degree">MCA in Information Technology</h4>
            <p className="frame-caption__university">Anurag University</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Connect;
