import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { AppRoute } from '../../types';
import { Cpu, Aperture, Video } from 'lucide-react';

interface HubProps {
  onNavigate: (route: AppRoute) => void;
}

export const Hub: React.FC<HubProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter">
          C4 STUDIO
        </h1>
        <p className="text-indigo-300 font-mono tracking-widest text-sm uppercase">
          Creative Cybernetics Command Center
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* App 1: Nexus Gen */}
        <GlassCard 
          interactive 
          onClick={() => onNavigate(AppRoute.NEXUS_GEN)}
          className="group min-h-[300px] flex flex-col"
        >
          <div className="mb-6 w-16 h-16 rounded-full bg-brand-orange/10 border border-brand-orange/30 flex items-center justify-center group-hover:bg-brand-orange/20 transition-colors">
            <Cpu className="text-brand-orange" size={32} />
          </div>
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">
            NEXUS GEN
          </h3>
          <p className="text-slate-400 font-sans text-sm leading-relaxed mb-8 flex-1">
            High-fidelity generative visual engine. Capable of creating 4K artifact assets from textual inputs using the Gemini 3 Pro matrix.
          </p>
          <div className="flex items-center text-xs font-orbitron text-brand-orange tracking-widest">
            INITIALIZE <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </div>
        </GlassCard>

        {/* App 2: Flux Edit */}
        <GlassCard 
          interactive 
          onClick={() => onNavigate(AppRoute.FLUX_EDIT)}
          className="group min-h-[300px] flex flex-col"
        >
          <div className="mb-6 w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
            <Aperture className="text-indigo-400" size={32} />
          </div>
          <h3 className="text-2xl font-orbitron font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
            FLUX EDIT
          </h3>
          <p className="text-slate-400 font-sans text-sm leading-relaxed mb-8 flex-1">
            Visual modification suite. Alter existing visual data with natural language commands powered by multimodal flash intelligence.
          </p>
          <div className="flex items-center text-xs font-orbitron text-indigo-400 tracking-widest">
            INITIALIZE <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
          </div>
        </GlassCard>

        {/* App 3: Placeholder/Coming Soon */}
        <GlassCard 
          className="opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 min-h-[300px] flex flex-col border-dashed"
        >
          <div className="mb-6 w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Video className="text-slate-500" size={32} />
          </div>
          <h3 className="text-2xl font-orbitron font-bold text-slate-500 mb-2">
            CHRONO VEO
          </h3>
          <p className="text-slate-600 font-sans text-sm leading-relaxed mb-8 flex-1">
            Temporal synthesis engine. Video generation capabilities are currently offline for maintenance and upgrade to Veo 3.1.
          </p>
          <div className="flex items-center text-xs font-orbitron text-slate-600 tracking-widest bg-slate-900/80 px-3 py-1 self-start rounded">
            LOCKED
          </div>
        </GlassCard>

      </div>
    </div>
  );
};