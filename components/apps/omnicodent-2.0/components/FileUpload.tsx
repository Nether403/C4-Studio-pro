import React, { useCallback, useState } from 'react';
import { Upload, X, FileScan } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (base64: string, file: File) => void;
  selectedImage: string | null;
  onClear: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedImage, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onFileSelect(result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  if (selectedImage) {
    return (
      <div className="relative w-full h-full min-h-[220px] bg-black/40 border border-brand-orange/30 rounded-xl overflow-hidden group shadow-inner">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <img src={selectedImage} alt="Input" className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-100 transition-opacity relative z-10" />
        
        {/* Tech Overlays */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onClear(); }}
          className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-500 text-white rounded-lg border border-red-400/50 backdrop-blur-sm transition-all shadow-lg z-20 group/close"
        >
          <X size={16} className="group-hover/close:rotate-90 transition-transform" />
        </button>
        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md border border-brand-orange/30 text-[10px] font-orbitron tracking-widest px-3 py-1.5 rounded text-brand-orange z-20 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
          SOURCE_LOCKED
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-input')?.click()}
      className={`
        relative w-full min-h-[220px] h-full flex flex-col items-center justify-center p-6
        border border-dashed rounded-xl transition-all duration-300 cursor-pointer overflow-hidden
        ${isDragging 
          ? 'border-brand-orange bg-brand-orange/10 scale-[1.01] shadow-[0_0_30px_rgba(249,115,22,0.2)]' 
          : 'border-white/10 bg-white/5 hover:border-brand-orange/50 hover:bg-white/10'}
      `}
    >
      <input 
        id="file-input" 
        type="file" 
        className="hidden" 
        accept="image/*,.pdf" 
        onChange={handleInputChange} 
      />
      
      <div className={`
        relative p-5 rounded-full mb-4 transition-all duration-300 group
        ${isDragging ? 'bg-brand-orange/20 scale-110' : 'bg-slate-800/50 border border-white/10'}
      `}>
        {isDragging ? (
          <FileScan className="w-10 h-10 text-brand-orange animate-pulse" />
        ) : (
          <Upload className="w-10 h-10 text-slate-400 group-hover:text-brand-orange transition-colors" />
        )}
      </div>
      
      <p className={`font-orbitron font-bold text-lg mb-2 tracking-wide transition-colors ${isDragging ? 'text-brand-orange' : 'text-slate-200'}`}>
        UPLOAD DATA
      </p>
      <p className="text-slate-500 text-xs font-mono text-center max-w-xs">
        [DRAG & DROP OR CLICK]<br/>
        SUPPORTED: PNG, JPG, WEBP, PDF
      </p>
      
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-l border-t transition-colors duration-300 ${isDragging ? 'border-brand-orange' : 'border-slate-600'}`}></div>
      <div className={`absolute top-0 right-0 w-3 h-3 border-r border-t transition-colors duration-300 ${isDragging ? 'border-brand-orange' : 'border-slate-600'}`}></div>
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-l border-b transition-colors duration-300 ${isDragging ? 'border-brand-orange' : 'border-slate-600'}`}></div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-r border-b transition-colors duration-300 ${isDragging ? 'border-brand-orange' : 'border-slate-600'}`}></div>
    </div>
  );
};

export default FileUpload;