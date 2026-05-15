import { lazy, Suspense } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomCursor from './components/CustomCursor';

// Lazy-load heavy sections — they load only when needed
const Projects      = lazy(() => import('./components/Projects'));
const Experience    = lazy(() => import('./components/Experience'));
const Certifications = lazy(() => import('./components/Certifications'));
const BeyondPixels  = lazy(() => import('./components/BeyondPixels'));
const Connect       = lazy(() => import('./components/Connect'));
const Footer        = lazy(() => import('./components/Footer'));

// Minimal fallback — invisible so the page feels instant
const Fallback = () => <div style={{ minHeight: '200px' }} />;

function App() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <div className="gradient-line" />
        <Suspense fallback={<Fallback />}>
          <Projects />
        </Suspense>
        <div className="gradient-line" />
        <Suspense fallback={<Fallback />}>
          <Experience />
        </Suspense>
        <div className="gradient-line" />
        <Suspense fallback={<Fallback />}>
          <Certifications />
        </Suspense>
        <div className="gradient-line" />
        <Suspense fallback={<Fallback />}>
          <BeyondPixels />
        </Suspense>
        <div className="gradient-line" />
        <Suspense fallback={<Fallback />}>
          <Connect />
        </Suspense>
      </main>
      <Suspense fallback={<Fallback />}>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;
