import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const IntroVideo = () => {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [videoInitialized, setVideoInitialized] = useState(false);

  // Initialize in-memory video element on mount (never added to DOM)
  useEffect(() => {
    const video = document.createElement('video');
    video.src = "/intro_video.mp4";
    video.muted = false;
    video.volume = 1.0;
    video.preload = "auto";
    video.loop = true;
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

    video.addEventListener('loadeddata', drawStaticFrame);
    video.addEventListener('seeked', drawStaticFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('loadeddata', drawStaticFrame);
      video.removeEventListener('seeked', drawStaticFrame);
    };
  }, [videoInitialized]);

  // Telemetry event listeners
  useEffect(() => {
    if (!videoInitialized) return;
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setDuration(video.duration);
      }
    };

    const onLoadedMetadata = () => setDuration(video.duration);

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onEnded);

    if (video.duration) setDuration(video.duration);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onEnded);
    };
  }, [videoInitialized]);

  // Click: toggle play/pause with sound
  const handlePlayerClick = (e) => {
    if (e) e.stopPropagation();
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

  const handleScrub = (e) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.min(Math.max(clickX / rect.width, 0), 1);
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Controls visible when paused or hovered
  const showControls = !isPlaying || isHovered;

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
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
          <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
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
          </div>

          {/* Large Centered Play Button Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isPlaying ? 'transparent' : 'rgba(0,0,0,0.4)',
            transition: 'background 0.3s ease',
            pointerEvents: 'none',
            zIndex: 2,
          }}>
            <motion.div
              animate={{
                scale: !isPlaying ? 1 : 0.8,
                opacity: !isPlaying ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255, 255, 255, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <Play size={26} fill="#ffffff" color="#ffffff" style={{ marginLeft: '4px' }} />
            </motion.div>
          </div>

          {/* Controls Bar */}
          <motion.div
            animate={{
              y: showControls ? 0 : 20,
              opacity: showControls ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              padding: '24px 20px 16px',
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              pointerEvents: 'auto',
            }}
          >
            {/* Progress Bar */}
            <div
              ref={progressBarRef}
              onClick={handleScrub}
              style={{
                width: '100%',
                height: '5px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '99px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: '#4f8ef7',
                borderRadius: '99px',
                position: 'absolute',
                left: 0,
              }} />
              <div style={{
                width: '12px',
                height: '12px',
                background: '#ffffff',
                borderRadius: '50%',
                position: 'absolute',
                left: `calc(${progress}% - 6px)`,
                boxShadow: '0 0 10px rgba(79, 142, 247, 0.8)',
                opacity: isHovered || isMobileDevice ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }} />
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={handlePlayerClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0,
                    opacity: 0.85,
                    transition: 'opacity 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0.85}
                >
                  {isPlaying ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" />}
                </button>

                <div style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: "'Outfit', monospace",
                  fontWeight: 500,
                }}>
                  {formatTime(currentTime)} <span style={{ color: 'rgba(255,255,255,0.35)' }}>/</span> {formatTime(duration)}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default IntroVideo;
