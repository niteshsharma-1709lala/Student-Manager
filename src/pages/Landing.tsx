import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeLogo } from '../components/EyeLogo';

export function Landing() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-700 ease-in-out ${isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <button 
        onClick={handleClick}
        className="group flex flex-col items-center gap-12 focus:outline-none transition-transform duration-500 hover:scale-105"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-red-500/20 blur-3xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <EyeLogo size={280} hasVeins={true} />
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl md:text-7xl font-bold font-display text-white tracking-tight opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-lg">
            Eye On Students
          </h1>
          <p className="text-amber-400 font-medium tracking-widest uppercase text-sm animate-pulse">
            Click to enter
          </p>
        </div>
      </button>
    </div>
  );
}
