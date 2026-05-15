import { useEffect, useRef } from 'react';
import useMousePosition from '../hooks/useMousePosition';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const { x, y } = useMousePosition();

  useEffect(() => {
    if (dotRef.current) {
      dotRef.current.style.left = `${x}px`;
      dotRef.current.style.top = `${y}px`;
    }
  }, [x, y]);

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#ffffff',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'difference',
        transition: 'transform 0.08s ease',
      }}
    />
  );
};

export default CustomCursor;
