import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const IntroVideo = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [videoInitialized, setVideoInitialized] = useState(false);

  // Initialize in-memory video element on mount (never added to DOM)
  useEffect(() => {
    const video = document.createElement('video');
    video.src = "/intro_video.mp4";
    video.muted = false;
    video.volume = 1.0;
    video.preload = "auto";
    video.loop = false; // Play once only
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    videoRef.current = video;
    setVideoInitialized(true);

    return () => {
      video.pause();
      videoRef.current = null;
      setVideoInitialized(false);
    };
  }, []);

  // Detect mobile/touch devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.matchMedia('(hover: none)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Canvas rendering loop
  useEffect(() => {
    if (!videoInitialized) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      if (video.readyState >= 2) {
        const vw = video.videoWidth;
        const vh = video.videoHeight;
        if (vw && vh) {
          if (canvas.width !== vw || canvas.height !== vh) {
            canvas.width = vw;
            canvas.height = vh;
          }
          const sWidth = vw * 0.86;
          const sHeight = vh * 0.86;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const drawStaticFrame = () => {
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (vw && vh) {
        canvas.width = vw;
        canvas.height = vh;
        ctx.drawImage(video, 0, 0, vw * 0.86, vh * 0.86, 0, 0, canvas.width, canvas.height);
      }
    };

    // When video ends, show play button again
    const onEnded = () => {
      setIsPlaying(false);
      // Reset to first frame
      video.currentTime = 0;
    };

    video.addEventListener('loadeddata', drawStaticFrame);
    video.addEventListener('seeked', drawStaticFrame);
    video.addEventListener('ended', onEnded);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('loadeddata', drawStaticFrame);
      video.removeEventListener('seeked', drawStaticFrame);
      video.removeEventListener('ended', onEnded);
    };
  }, [videoInitialized]);

  // Click anywhere on video: toggle play/pause
  const handlePlayerClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.muted = false;
      video.volume = 1.0;
      video.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play failed:', err));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="intro-video"
      style={{
        width: '100%',
        background: '#000',
        padding: isMobileDevice ? '40px 0 60px' : '80px 0 100px',
        position: 'relative',
        zIndex: 5,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{
        maxWidth: '1000px',
        width: '100%',
        padding: '0 clamp(20px, 5vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Section Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            fontSize: '11px',
            color: '#8a8a8a',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 500,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#4f8ef7', borderRadius: '50%' }} />
            Showreel
          </div>
          <h2 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 700,
            color: '#ffffff',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            Creative Process In Motion
          </h2>
        </div>

        {/* Video Player Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={handlePlayerClick}
          style={{
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.08)',
            background: '#09090b',
            overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(79, 142, 247, 0.06)',
            cursor: 'pointer',
          }}
        >
          {/* Canvas rendering cropped video frames */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute',
              top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              pointerEvents: 'none',
            }}
          />

          {/* Dark overlay when paused */}
          <motion.div
            animate={{ opacity: isPlaying ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.38)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          {/* Glassy center Play / Pause button */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            zIndex: 2,
          }}>
            <motion.div
              animate={{
                scale: isPlaying ? 0.75 : 1,
                opacity: isPlaying ? 0 : 1,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1.5px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <Play size={28} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroVideo;
