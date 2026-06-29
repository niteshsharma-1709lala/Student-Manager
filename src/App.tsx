import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { School, Home as HomeIcon } from 'lucide-react';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { StudentProfile } from './pages/StudentProfile';
import { EyeLogo } from './components/EyeLogo';
import { BackgroundPatterns } from './components/BackgroundPatterns';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative overflow-hidden">
      <BackgroundPatterns />
      
      {!isLanding && (
        <header className="bg-slate-800 border-b border-slate-700 py-4 px-4 sm:px-6 lg:px-8 relative z-10 animate-in fade-in duration-1000">
          <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3">
              <EyeLogo size={40} />
              <div>
                <h1 className="text-xl font-bold font-display text-white tracking-tight">Eye On Students</h1>
              </div>
            </Link>
            <Link 
              to="/" 
              className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-700 bg-slate-800/50 border border-slate-700 hover:border-slate-600"
              aria-label="Go to landing page"
            >
              <HomeIcon size={20} />
            </Link>
          </div>
        </header>
      )}

      <main className="flex-1 relative z-10 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/student/:id" element={<StudentProfile />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
