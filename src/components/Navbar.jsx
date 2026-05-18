import { Home, FolderOpen, Briefcase, Camera, Zap, FileText, Mail, Award } from 'lucide-react';

const Navbar = () => {
  const links = [
    { icon: Home, label: 'Home', href: '#hero' },
    { icon: FolderOpen, label: 'Projects', href: '#projects' },
    { icon: Briefcase, label: 'Experience', href: '#experience' },
    { icon: Award, label: 'Certifications', href: '#certifications' },
    { icon: Camera, label: 'Beyond Pixels', href: '#instagram' },
    { icon: Zap, label: 'Connect', href: '#connect' },
    { icon: Mail, label: 'Email', href: 'mailto:jaalthariamarendar@gmail.com' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <div className="navbar__brand-icon">JA</div>
        <span>Amar</span>
      </div>
      <div className="navbar__links">
        {links.map(({ icon: Icon, label, href, target }) => (
          <a
            key={label}
            id={`nav-${label.toLowerCase()}`}
            href={href}
            target={target}
            rel={target ? 'noopener noreferrer' : undefined}
            className="navbar__link"
            aria-label={label}
          >
            <Icon size={17} strokeWidth={1.8} />
            <span className="tooltip">{label}</span>
          </a>
        ))}
      </div>
      <a
        id="nav-resume"
        href="/uiuxresume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="navbar__resume"
        aria-label="Resume"
      >
        <FileText size={17} strokeWidth={1.8} />
        <span className="tooltip">Resume</span>
      </a>
    </nav>
  );
};

export default Navbar;
