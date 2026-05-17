import { motion } from 'framer-motion';
import { Award, ExternalLink, ShieldCheck } from 'lucide-react';

const certifications = [
  {
    id: 1,
    title: 'Foundations of User Experience (UX) Design',
    issuer: 'Google (Coursera)',
    date: 'Jan 2025',
    link: 'https://coursera.org/verify/U820VPSTMRHA',
    image: '/google-ux-cert.webp',
    aspectRatio: '1.414 / 1',
    color: '#4285F4'
  },
  {
    id: 2,
    title: 'Certified Professional - Python Full Stack',
    issuer: 'Codegnan IT Solutions',
    date: 'May 2026',
    link: 'https://cg-course-completion-certificates.s3.amazonaws.com/Course_completions/PFS-HYJ-038/CDH1788_portrait.png',
    image: '/python-fullstack-cert.webp',
    aspectRatio: '0.707 / 1', // Portrait
    color: '#E61E2A'
  },
  {
    id: 3,
    title: 'Certificate of Completion - Python Full Stack',
    issuer: 'Codegnan IT Solutions',
    date: 'May 2026',
    link: 'https://cg-course-completion-certificates.s3.amazonaws.com/Course_completions/PFS-HYJ-038/CDH1788_landscape.png',
    image: '/python-fullstack-landscape.webp',
    aspectRatio: '1.414 / 1', // Landscape
    color: '#E61E2A'
  }
];

const Certifications = () => {
  return (
    <section id="certifications" className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <div className="section-label">Credentials</div>
        <h2 className="section-title">Certifications & Awards</h2>
        <p className="section-subtitle" style={{ marginBottom: '48px' }}>
          Continuous learning is the key to staying ahead. Here are some of the professional certifications I&apos;ve earned.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: cert.image ? '16px' : '24px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              {/* Image Preview if available */}
              {cert.image && (
                <div style={{
                  width: '100%',
                  aspectRatio: cert.aspectRatio || '1.414 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#000',
                  border: '1px solid rgba(255,255,255,0.05)',
                  marginBottom: '8px'
                }}>
                  <img
                    src={cert.image}
                    alt={cert.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
              )}

              {/* Background Accent Glow */}
              <div style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '80px',
                height: '80px',
                background: cert.color,
                filter: 'blur(50px)',
                opacity: 0.1,
                pointerEvents: 'none'
              }} />

              <div style={{ padding: cert.image ? '0 8px 8px' : '0' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.05)',
                  marginBottom: '12px'
                }}>
                  <Award size={18} color={cert.color} />
                </div>

                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    {cert.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={12} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {cert.issuer} • {cert.date}
                    </span>
                  </div>
                </div>

                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginTop: '16px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--text-primary)',
                    opacity: 0.6,
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '0.6'}
                >
                  Verify Credential
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
