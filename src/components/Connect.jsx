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
          <a href="https://linkedin.com/in/jaalthariamarendar" target="_blank" rel="noreferrer" className="connect-btn">Linkedin</a>
          <a href="https://instagram.com/jaalthariamarendar" target="_blank" rel="noreferrer" className="connect-btn">Instagram</a>
          <a href="mailto:jaalthariamarendar@gmail.com?subject=1:1 Mentorship" className="connect-btn connect-btn-primary">1:1 Mentorship</a>
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
