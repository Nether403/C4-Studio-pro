import React, { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { TechButton } from '../ui/TechButton';
import { TechInput, TechTextArea } from '../ui/TechInput';
import { generateImage } from '../../services/gemini';
import { Zap, Download, RefreshCw, Layers } from 'lucide-react';

export const NexusGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("1:1");

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setResult(null);
    try {
      const base64Image = await generateImage(prompt, aspectRatio);
      setResult(base64Image);
    } catch (e) {
      console.error(e);
      alert("System Failure: Generation aborted. Please check API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (result) {
      const link = document.createElement('a');
      link.href = result;
      link.download = `nexus-artifact-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-6">
        <GlassCard header="NEXUS CONTROLS" subHeader="SEQUENCE V.3.1">
          <div className="space-y-6">
            <TechTextArea 
              label="Visual Prompt" 
              placeholder="Describe the artifact to manifest..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
            />
            
            <div className="space-y-2">
              <label className="block font-orbitron text-xs text-brand-orange tracking-widest mb-2 uppercase">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`
                      py-2 px-1 border font-orbitron text-xs
                      ${aspectRatio === ratio 
                        ? 'bg-brand-orange/20 border-brand-orange text-brand-orange shadow-[0_0_10px_rgba(249,115,22,0.2)]' 
                        : 'bg-black/20 border-white/10 text-slate-500 hover:border-white/30'}
                    `}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <TechButton 
              fullWidth 
              onClick={handleGenerate} 
              isLoading={loading}
              icon={<Zap size={18} />}
            >
              Initialize Generation
            </TechButton>
          </div>
        </GlassCard>

        {/* Status Log */}
        <GlassCard className="min-h-[200px]">
          <div className="font-orbitron text-xs text-slate-500 mb-2 flex items-center gap-2">
            <Layers size={14} /> SYSTEM LOG
          </div>
          <div className="font-mono text-xs text-slate-400 space-y-1">
            <p>> System Ready.</p>
            <p>> Model: Gemini-3-Pro-Image</p>
            {loading && <p className="text-brand-orange animate-pulse">> Processing request protocol...</p>}
            {result && <p className="text-green-400">> Artifact materialized successfully.</p>}
          </div>
        </GlassCard>
      </div>

      {/* Viewport */}
      <div className="lg:col-span-8">
        <GlassCard className="h-full min-h-[500px] flex flex-col" header="VIEWPORT" subHeader="RENDER OUTPUT">
          <div className="flex-1 rounded-sm border border-white/5 bg-black/40 flex items-center justify-center overflow-hidden relative group">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-brand-orange/30 border-t-brand-orange rounded-full animate-spin mx-auto mb-4" />
                  <p className="font-orbitron text-brand-orange animate-pulse">MATERIALIZING...</p>
                </div>
              </div>
            )}
            
            {result ? (
              <>
                <img src={result} alt="Generated" className="max-h-full max-w-full object-contain shadow-2xl" />
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <TechButton variant="secondary" onClick={handleDownload} icon={<Download size={16} />}>
                    SAVE
                  </TechButton>
                </div>
              </>
            ) : (
              <div className="text-center opacity-30 select-none">
                <div className="w-24 h-24 border border-dashed border-white/20 mx-auto mb-4 flex items-center justify-center">
                  <Zap size={32} />
                </div>
                <p className="font-orbitron tracking-widest text-sm">AWAITING INPUT</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};