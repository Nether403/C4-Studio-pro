import React, { useState, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { TechButton } from '../ui/TechButton';
import { TechTextArea } from '../ui/TechInput';
import { editImage, fileToBase64 } from '../../services/gemini';
import { Wand2, Upload, Download, ArrowRight, X } from 'lucide-react';

export const FluxEdit: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setSourceImage(base64);
        setResult(null); // Clear previous result
      } catch (err) {
        console.error("File error", err);
      }
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt.trim()) return;

    setLoading(true);
    try {
      const editedBase64 = await editImage(sourceImage, prompt);
      setResult(editedBase64);
    } catch (e) {
      console.error(e);
      alert("Modification Failed: " + (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `flux-edit-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Source Column */}
        <div className="flex flex-col gap-6">
          <GlassCard header="SOURCE MATRIX" subHeader="INPUT IMAGE" className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-black/40 border border-white/5 rounded-sm overflow-hidden flex items-center justify-center group">
               {sourceImage ? (
                 <>
                   <img src={sourceImage} alt="Source" className="max-w-full max-h-[400px] object-contain" />
                   <button 
                    onClick={() => setSourceImage(null)}
                    className="absolute top-2 right-2 p-2 bg-red-600/80 text-white rounded hover:bg-red-500 transition-colors"
                   >
                     <X size={16} />
                   </button>
                 </>
               ) : (
                 <div className="text-center p-8">
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="group-hover:scale-105 transition-transform duration-300"
                   >
                     <div className="w-20 h-20 border border-brand-orange/30 flex items-center justify-center rounded-full mx-auto mb-4 bg-brand-orange/5 group-hover:bg-brand-orange/10 group-hover:border-brand-orange">
                       <Upload className="text-brand-orange" size={32} />
                     </div>
                   </button>
                   <p className="font-orbitron text-slate-400 text-sm">UPLOAD SOURCE</p>
                 </div>
               )}
               <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
               />
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <TechTextArea 
                placeholder="Describe desired modification (e.g., 'Make it cyberpunk', 'Add a neon rain effect')..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={loading}
              />
              <TechButton 
                fullWidth 
                onClick={handleEdit} 
                isLoading={loading}
                disabled={!sourceImage}
                icon={<Wand2 size={18} />}
              >
                EXECUTE FLUX MODIFICATION
              </TechButton>
            </div>
          </GlassCard>
        </div>

        {/* Result Column */}
        <div className="flex flex-col gap-6">
          <GlassCard header="RESULT MATRIX" subHeader="OUTPUT IMAGE" className="flex-1 flex flex-col">
            <div className="flex-1 relative bg-black/40 border border-white/5 rounded-sm overflow-hidden flex items-center justify-center">
              {loading && (
                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                   <div className="w-full max-w-[200px] h-1 bg-slate-800 rounded-full overflow-hidden mb-4">
                     <div className="h-full bg-brand-orange animate-[scan_2s_infinite]" />
                   </div>
                   <p className="font-orbitron text-xs tracking-widest animate-pulse text-brand-orange">APPLYING FLUX ALGORITHMS</p>
                 </div>
              )}
              
              {result ? (
                <img src={result} alt="Edited" className="max-w-full max-h-[600px] object-contain" />
              ) : (
                <div className="text-slate-600 font-orbitron text-xs tracking-widest flex items-center gap-2">
                  <ArrowRight size={16} /> WAITING FOR EXECUTION
                </div>
              )}
            </div>
            
            {result && (
              <div className="mt-6">
                <TechButton variant="secondary" fullWidth onClick={handleDownload} icon={<Download size={18} />}>
                  EXTRACT TO LOCAL DRIVE
                </TechButton>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};