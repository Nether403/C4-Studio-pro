import React from 'react';
import { HistoryItem } from '../types';
import { Clock, RotateCcw, Database } from 'lucide-react';

interface HistoryBarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  currentId?: string;
}

const HistoryBar: React.FC<HistoryBarProps> = ({ history, onSelect, currentId }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full h-32 flex-shrink-0 bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex items-center px-8 gap-6 overflow-x-auto z-30 relative shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Label */}
      <div className="flex-shrink-0 flex flex-col justify-center gap-1 text-slate-500 mr-2 border-r border-white/10 pr-6 h-16">
        <div className="flex items-center gap-2 text-brand-orange">
          <Database size={18} />
          <span className="text-xs font-orbitron tracking-widest font-bold uppercase">Mission Logs</span>
        </div>
        <span className="text-[10px] font-mono text-slate-600 tracking-tight">{history.length} ARTIFACTS ARCHIVED</span>
      </div>
      
      {history.slice().reverse().map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          className={`
            group relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border transition-all duration-300
            ${item.id === currentId 
              ? 'border-brand-orange shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-105 opacity-100 ring-1 ring-brand-orange/50' 
              : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30 hover:scale-[1.02]'}
          `}
        >
          {item.originalImage ? (
            <img src={item.originalImage} alt="Thumbnail" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-mono tracking-tighter">
              NO DATA
            </div>
          )}
          
          {/* Overlay info */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-2">
            <span className="text-[9px] font-mono text-slate-300 w-full text-left font-bold truncate">
              CMD_{item.id.slice(-4)}
            </span>
            <span className="text-[8px] font-mono text-slate-500 w-full text-left">
              {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>

          {/* Active indicator */}
          {item.id === currentId && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full shadow-[0_0_8px_#f97316]"></div>
          )}

          <div className="absolute inset-0 bg-brand-orange/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
            <RotateCcw size={24} className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryBar;