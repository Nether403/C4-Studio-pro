import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  header?: string;
  subHeader?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  interactive = false,
  onClick,
  header,
  subHeader
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-slate-900/40 backdrop-blur-xl
        border border-white/10
        ${interactive ? 'cursor-pointer hover:border-orange-500/30 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {/* Tech decoration corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-brand-orange/50 opacity-50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-brand-orange/50 opacity-50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-brand-orange/50 opacity-50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-brand-orange/50 opacity-50" />
      
      {/* Header Section */}
      {(header || subHeader) && (
        <div className="p-4 border-b border-white/5 bg-black/20">
          {header && <h3 className="font-orbitron text-white tracking-widest text-lg font-bold">{header}</h3>}
          {subHeader && <p className="font-sans text-slate-400 text-xs tracking-wider uppercase">{subHeader}</p>}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};