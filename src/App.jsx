import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Connect from './components/Connect';
import Certifications from './components/Certifications';
import BeyondPixels from './components/BeyondPixels';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <div className="gradient-line" />
        <Projects />
        <div className="gradient-line" />
        <Experience />
        <div className="gradient-line" />
        <Certifications />
        <div className="gradient-line" />
        <BeyondPixels />
        <div className="gradient-line" />
        <Connect />
      </main>
      <Footer />
    </>
  );
}

export default App;
