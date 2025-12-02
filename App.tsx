import React, { useState } from 'react';
import { AppRoute } from './types';
import { Hub } from './components/apps/Hub';
import { NexusGen } from './components/apps/NexusGen';
import { FluxEdit } from './components/apps/FluxEdit';
import { ChevronLeft, Terminal } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(AppRoute.HUB);

  const renderContent = () => {
    switch (currentRoute) {
      case AppRoute.NEXUS_GEN:
        return <NexusGen />;
      case AppRoute.FLUX_EDIT:
        return <FluxEdit />;
      case AppRoute.HUB:
      default:
        return <Hub onNavigate={setCurrentRoute} />;
    }
  };

  return (
    <div className="min-h-screen relative text-slate-200 font-sans selection:bg-brand-orange/30 selection:text-white">
      {/* Background Layers */}
      <div className="bg-void" />
      <div className="noise" />
      <div className="scanlines" />
      
      {/* Animated Particles (CSS implementation in index.html, placed here structurally) */}
      <div className="fixed inset-0 pointer-events-none z-[-5]">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Top Navigation Bar (Only visible if not on Hub) */}
      {currentRoute !== AppRoute.HUB && (
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentRoute(AppRoute.HUB)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              >
                <ChevronLeft className="text-slate-400 group-hover:text-white" />
              </button>
              <div className="w-px h-6 bg-white/10" />
              <h2 className="font-orbitron font-bold text-lg tracking-wider text-white">
                {currentRoute === AppRoute.NEXUS_GEN ? 'NEXUS GEN' : 'FLUX EDIT'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
               <span className="font-mono text-xs text-slate-500 uppercase">System Online</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={`relative z-10 p-4 md:p-8 ${currentRoute === AppRoute.HUB ? 'flex items-center min-h-screen' : ''}`}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full py-2 px-4 border-t border-white/5 bg-slate-950/90 backdrop-blur-sm z-40 flex justify-between items-center text-[10px] text-slate-600 font-mono uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <Terminal size={12} />
          <span>C4 STUDIO // BUILD 2024.10.15</span>
        </div>
        <div>
           SECURE CONNECTION ESTABLISHED
        </div>
      </footer>
    </div>
  );
}