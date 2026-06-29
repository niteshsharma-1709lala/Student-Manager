import React, { useState, useEffect, useRef } from 'react';

export function EyeLogo({ size = 32, hasVeins = false }: { size?: number, hasVeins?: boolean }) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!eyeRef.current) return;

      const eye = eyeRef.current.getBoundingClientRect();
      const eyeCenterX = eye.left + eye.width / 2;
      const eyeCenterY = eye.top + eye.height / 2;

      const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
      
      // Calculate distance from center, capped at max distance for the pupil
      const distance = Math.min(
        eye.width / 4,
        Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10 // Scale factor
      );

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={eyeRef}
      className="bg-white rounded-full flex items-center justify-center relative overflow-hidden shadow-inner border-2 border-slate-300"
      style={{ width: size, height: size }}
    >
      {hasVeins && (
        <svg
          className="absolute inset-0 w-full h-full text-red-500/40 pointer-events-none"
          viewBox="0 0 100 100"
        >
          {/* Left veins */}
          <path d="M 0 50 Q 15 45 30 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 5 30 Q 15 35 25 45" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 0 70 Q 15 65 25 55" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M 15 15 Q 22 30 35 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M 15 85 Q 22 70 35 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M 5 15 Q 15 25 20 35" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M 5 85 Q 15 75 20 65" fill="none" stroke="currentColor" strokeWidth="0.6" />

          {/* Right veins */}
          <path d="M 100 50 Q 85 45 70 50" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 95 30 Q 85 35 75 45" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 100 70 Q 85 65 75 55" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M 85 15 Q 78 30 65 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M 85 85 Q 78 70 65 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
          <path d="M 95 15 Q 85 25 80 35" fill="none" stroke="currentColor" strokeWidth="0.6" />
          <path d="M 95 85 Q 85 75 80 65" fill="none" stroke="currentColor" strokeWidth="0.6" />
        </svg>
      )}
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <div 
          className="bg-slate-900 rounded-full absolute flex items-center justify-center transition-transform duration-100 ease-out"
          style={{ 
            width: size * 0.45, 
            height: size * 0.45,
            transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
          }}
        >
          <div 
            className="bg-white rounded-full absolute"
            style={{
              width: size * 0.12,
              height: size * 0.12,
              top: '20%',
              left: '20%'
            }}
          />
        </div>
      </div>
    </div>
  );
}
