import React from 'react';

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const TechButton: React.FC<TechButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  className = '',
  icon,
  ...props 
}) => {
  
  const baseStyles = "relative overflow-hidden font-orbitron font-bold tracking-wider uppercase text-sm px-6 py-3 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-gradient text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] hover:brightness-110 border border-transparent",
    secondary: "bg-slate-900/60 border border-indigo-500/30 text-indigo-300 hover:border-indigo-400 hover:text-indigo-200 hover:bg-slate-800/60 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)]",
    ghost: "bg-transparent text-slate-400 hover:text-white border border-transparent hover:border-white/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Scan overlay for primary */}
      {variant === 'primary' && !isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/2 -skew-x-12 translate-x-[-150%] animate-[scan_3s_infinite]" />
      )}
      
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>PROCESSING</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};