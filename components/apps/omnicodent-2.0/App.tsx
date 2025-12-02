import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layout, 
  Maximize2, 
  Cpu,
  Activity,
  Aperture,
  Code
} from 'lucide-react';
import FileUpload from './components/FileUpload';
import VoiceInput from './components/VoiceInput';
import PreviewFrame from './components/PreviewFrame';
import HistoryBar from './components/HistoryBar';
import { generateAppFromImage } from './services/geminiService';
import { HistoryItem, ViewMode } from './types';

function App() {
  // State
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('omnicodent_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history on change with Quota Handling
  useEffect(() => {
    if (history.length === 0) return;

    const saveToStorage = (data: HistoryItem[]) => {
      try {
        localStorage.setItem('omnicodent_history', JSON.stringify(data));
      } catch (e: any) {
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          console.warn("Storage quota exceeded. Trimming old history...");
          if (data.length > 1) {
            // Remove the oldest item (first in array) and try again
            // We update state as well to keep sync
            const trimmedHistory = data.slice(1);
            setHistory(trimmedHistory); 
            // The state update will trigger this effect again, 
            // so we don't need to recursively call saveToStorage here directly.
          } else {
            console.error("Cannot save even a single item. Storage is full.");
          }
        } else {
          console.error("Failed to save history:", e);
        }
      }
    };

    saveToStorage(history);
  }, [history]);

  const handleGenerate = async () => {
    if (!selectedImage && !prompt) return;

    setIsGenerating(true);
    setLoadingStep('INITIALIZING NEURAL LINK...');
    setGeneratedCode(null);

    try {
      // Simulated steps for UX
      setTimeout(() => setLoadingStep('ANALYZING VISUAL ARTIFACTS...'), 800);
      setTimeout(() => setLoadingStep('ARCHITECTING SOLUTION...'), 2000);
      setTimeout(() => setLoadingStep('SYNTHESIZING CODE...'), 3500);

      const code = await generateAppFromImage(selectedImage, prompt);
      
      const newId = Date.now().toString();
      
      // Optimization: Don't store duplicate base64 string in thumbnail if possible
      // (Though HistoryItem interface expects it, we can manage it smarter in a real app)
      const newItem: HistoryItem = {
        id: newId,
        timestamp: Date.now(),
        originalImage: selectedImage,
        prompt: prompt,
        code: code,
        thumbnail: null // Save space, rely on originalImage in UI
      };

      setHistory(prev => [...prev, newItem]);
      setCurrentId(newId);
      setGeneratedCode(code);
      setViewMode('preview'); // Auto switch to preview
    } catch (error) {
      console.error(error);
      alert("Mission Failed: Unable to generate code. Please try again.");
    } finally {
      setIsGenerating(false);
      setLoadingStep('');
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setSelectedImage(item.originalImage);
    setPrompt(item.prompt);
    setGeneratedCode(item.code);
    setCurrentId(item.id);
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPrompt('');
    setGeneratedCode(null);
    setCurrentId(null);
  };

  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden text-slate-200">
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none z-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none z-0"></div>

      {/* Header */}
      <header className="h-20 flex-shrink-0 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between px-8 z-20 relative shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-brand-orange blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/5 border border-white/10 p-2.5 rounded-lg group-hover:border-brand-orange/30 transition-colors">
              <Cpu size={28} className="text-brand-orange" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-orbitron font-bold tracking-widest text-white flex items-center gap-2">
              OMNICODENT <span className="text-brand-orange">2.0</span>
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
              <p className="text-[10px] text-slate-400 font-orbitron tracking-[0.2em] uppercase">Gemini 3.0 // Neural Bridge Active</p>
            </div>
          </div>
        </div>

        {/* View Controls */}
        {generatedCode && (
          <div className="flex items-center bg-black/40 p-1.5 rounded-lg border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setViewMode('preview')}
              className={`p-2 rounded transition-all font-orbitron text-xs tracking-wider flex items-center gap-2 ${viewMode === 'preview' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <Maximize2 size={16} /> VIEW
            </button>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <button
              onClick={() => setViewMode('split')}
              className={`p-2 rounded transition-all font-orbitron text-xs tracking-wider flex items-center gap-2 ${viewMode === 'split' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <Layout size={16} /> SPLIT
            </button>
            <div className="w-px h-4 bg-white/10 mx-1"></div>
            <button
               onClick={() => setViewMode('code')}
               className={`p-2 rounded transition-all font-orbitron text-xs tracking-wider flex items-center gap-2 ${viewMode === 'code' ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
             >
               <Code size={16} /> CODE
             </button>
          </div>
        )}
      </header>

      {/* Main Workspace - Scrollable */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 scrollbar-hide">
        <div className={`
            min-h-full p-6 flex flex-col items-center justify-center transition-all duration-700
            ${generatedCode ? 'lg:flex-row lg:items-start lg:gap-6' : 'max-w-4xl mx-auto'}
        `}>
          
          {/* Input Panel */}
          <div className={`
            flex flex-col transition-all duration-700 ease-in-out w-full
            ${generatedCode ? 'lg:w-[400px] flex-shrink-0' : 'max-w-3xl'}
          `}>
            {/* Panel Card */}
            <div className="relative w-full bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col gap-6 shadow-2xl overflow-hidden group">
              {/* Tech Decoration: Corner Markers */}
              <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-brand-orange/50 rounded-tl-lg opacity-60"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/10 rounded-tr-lg opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/10 rounded-bl-lg opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-brand-orange/50 rounded-br-lg opacity-60"></div>

              {/* Input Header */}
              {!generatedCode && (
                <div className="text-center space-y-4 mb-2 mt-4">
                  <div className="inline-flex items-center justify-center p-4 rounded-full bg-brand-orange/10 border border-brand-orange/20 mb-2 shadow-[0_0_30px_rgba(249,115,22,0.2)]">
                    <Aperture size={48} className="text-brand-orange animate-spin-slow" />
                  </div>
                  <h2 className="text-5xl font-orbitron font-bold text-white tracking-wide">
                    INITIALIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-red">CREATION</span>
                  </h2>
                  <p className="text-slate-400 font-light max-w-lg mx-auto text-lg">
                    Upload a sketch, wireframe, or concept art. The Gemini 3.0 matrix will reconstruct it into functional code.
                  </p>
                </div>
              )}

              {/* File Upload Zone */}
              <div className="flex-1 min-h-[260px] relative z-10">
                {!generatedCode && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-16 bg-white/10 rounded-full"></div>}
                <FileUpload 
                  onFileSelect={(base64) => setSelectedImage(base64)}
                  selectedImage={selectedImage}
                  onClear={handleClear}
                />
              </div>

              {/* Prompt & Controls */}
              <div className="flex flex-col gap-4 relative z-10">
                <div className="relative group/input">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange/20 to-brand-red/20 rounded-xl blur opacity-0 group-focus-within/input:opacity-100 transition duration-500"></div>
                  <div className="relative bg-black/40 rounded-xl border border-white/10 backdrop-blur-sm overflow-hidden">
                     <div className="px-4 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-orbitron tracking-widest text-brand-orange/80 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse"></span>
                         DIRECTIVE INPUT
                       </span>
                       <VoiceInput onTranscription={(text) => setPrompt(prev => prev ? prev + ' ' + text : text)} />
                     </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="// Describe logic, style overrides, or game mechanics..."
                      className="w-full bg-transparent border-none p-4 text-sm text-slate-200 font-mono focus:outline-none resize-none h-32 placeholder:text-slate-600 leading-relaxed"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || (!selectedImage && !prompt)}
                  className={`
                    relative w-full py-5 rounded-xl font-orbitron font-bold tracking-widest text-lg flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group/btn
                    ${isGenerating 
                      ? 'bg-slate-800/50 border border-white/5 text-slate-500 cursor-not-allowed' 
                      : 'bg-brand-gradient text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_50px_rgba(249,115,22,0.6)] hover:scale-[1.01] border border-white/20'}
                  `}
                >
                  {/* Button Scanline Effect */}
                  {!isGenerating && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] group-hover/btn:animate-scan"></div>}
                  
                  {isGenerating ? (
                    <>
                      <Activity size={20} className="animate-pulse text-brand-orange" />
                      <span className="animate-pulse">{loadingStep}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} className="group-hover/btn:rotate-12 transition-transform" />
                      <span>IGNITE GENERATION</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview / Split View */}
          {generatedCode && (
            <div className="flex-1 w-full h-full min-h-[600px] animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-forwards">
               <div className={`w-full h-full grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
                
                {/* Reference Image in Split Mode */}
                {viewMode === 'split' && selectedImage && (
                  <div className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col shadow-2xl relative group h-full max-h-[800px]">
                    <div className="absolute top-0 right-0 p-2 opacity-30 pointer-events-none">
                      <Layout size={100} className="text-white/5" />
                    </div>
                    <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></div>
                        <span className="text-xs font-orbitron tracking-widest text-indigo-300">SOURCE ARTIFACT</span>
                      </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-8 bg-black/20 overflow-auto">
                      <img src={selectedImage} alt="Reference" className="max-w-full max-h-full object-contain rounded-lg border border-white/5 shadow-xl" />
                    </div>
                  </div>
                )}

                {/* Live Preview */}
                {viewMode !== 'code' && (
                  <div className="flex flex-col h-full min-h-[600px] bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl relative">
                     <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                         <span className="text-xs font-orbitron tracking-widest text-green-400">LIVE ENVIRONMENT</span>
                       </div>
                       <div className="flex gap-1.5 opacity-50">
                         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                       </div>
                     </div>
                     <div className="flex-1 relative bg-white">
                        <PreviewFrame code={generatedCode} />
                     </div>
                  </div>
                )}
                 {/* Code View */}
                 {viewMode === 'code' && (
                     <div className="flex flex-col h-full min-h-[600px] bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl relative">
                         <div className="p-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                 <div className="w-2 h-2 bg-brand-orange rounded-full animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                                 <span className="text-xs font-orbitron tracking-widest text-brand-orange">GENERATED SOURCE</span>
                             </div>
                         </div>
                         <div className="flex-1 relative bg-slate-950 p-4 overflow-auto">
                             <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap">{generatedCode}</pre>
                         </div>
                     </div>
                 )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / History */}
      <HistoryBar 
        history={history} 
        onSelect={handleHistorySelect} 
        currentId={currentId || undefined} 
      />
      
    </div>
  );
}

export default App;