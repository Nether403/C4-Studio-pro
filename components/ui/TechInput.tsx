import React from 'react';

interface TechInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  fullWidth?: boolean;
}

export const TechInput: React.FC<TechInputProps> = ({ 
  label, 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label className="block font-orbitron text-xs text-brand-orange tracking-widest mb-2 uppercase">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          className={`
            bg-black/40 border border-white/10 text-white font-sans placeholder-slate-600
            px-4 py-3 outline-none transition-all duration-300
            focus:border-brand-orange/50 focus:shadow-[0_0_15px_rgba(249,115,22,0.1)]
            disabled:opacity-50
            w-full
            ${className}
          `}
          {...props}
        />
        {/* Animated bottom line */}
        <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-brand-orange transition-all duration-500 group-focus-within:w-full" />
      </div>
    </div>
  );
};

interface TechTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  fullWidth?: boolean;
}

export const TechTextArea: React.FC<TechTextAreaProps> = ({ 
  label, 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && (
        <label className="block font-orbitron text-xs text-brand-orange tracking-widest mb-2 uppercase">
          {label}
        </label>
      )}
      <div className="relative group">
        <textarea
          className={`
            bg-black/40 border border-white/10 text-white font-sans placeholder-slate-600
            px-4 py-3 outline-none transition-all duration-300
            focus:border-brand-orange/50 focus:shadow-[0_0_15px_rgba(249,115,22,0.1)]
            disabled:opacity-50
            w-full min-h-[120px] resize-none
            ${className}
          `}
          {...props}
        />
        <div className="absolute bottom-1 left-0 h-[1px] w-0 bg-brand-orange transition-all duration-500 group-focus-within:w-full" />
      </div>
    </div>
  );
};