import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Radio } from 'lucide-react';
import { transcribeAudio } from '../services/geminiService';

interface VoiceInputProps {
  onTranscription: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscription }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsProcessing(true);
        try {
          const text = await transcribeAudio(audioBlob);
          if (text) {
            onTranscription(text);
          }
        } catch (err) {
          console.error("Transcription error", err);
        } finally {
          setIsProcessing(false);
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`
        relative p-2 rounded-lg transition-all duration-300 flex items-center justify-center overflow-hidden border
        ${isRecording 
          ? 'bg-red-600/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse-slow' 
          : isProcessing
            ? 'bg-amber-500/10 text-amber-500 border-amber-500/30 cursor-wait'
            : 'text-slate-400 border-transparent hover:text-brand-orange hover:bg-brand-orange/10 hover:border-brand-orange/30'}
      `}
      title={isRecording ? "Stop Recording" : "Voice Command"}
    >
      {isRecording && (
        <span className="absolute inset-0 bg-red-500/10 animate-pulse"></span>
      )}
      
      {isProcessing ? (
        <Loader2 size={16} className="animate-spin" />
      ) : isRecording ? (
        <Square size={16} fill="currentColor" />
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
};

export default VoiceInput;