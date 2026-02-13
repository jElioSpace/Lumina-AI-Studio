import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface Props {
  onKeySelected: () => void;
}

export const ApiKeyChecker: React.FC<Props> = ({ onKeySelected }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkKeyStatus = async () => {
    // If we're not in an environment with the aistudio global, we assume we can't select via dialog
    if (typeof window === 'undefined' || !window.aistudio) {
      setChecking(false);
      // If process.env.API_KEY is somehow present, we can skip
      if (process.env.API_KEY) {
        onKeySelected();
      } else {
        // Otherwise we show the overlay as a fallback or if required
        setShowOverlay(true);
      }
      return;
    }

    try {
      if (window.aistudio.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        if (selected) {
          onKeySelected();
          setShowOverlay(false);
        } else {
          setShowOverlay(true);
        }
      } else {
        // Fallback if the method isn't there but the object is
        setShowOverlay(true);
      }
    } catch (e) {
      console.error("Error checking API key status:", e);
      setShowOverlay(true);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkKeyStatus();
    
    // Listen for custom reset events if an API call fails with "Requested entity was not found"
    const handleReset = () => {
      setShowOverlay(true);
    };
    window.addEventListener('reset-api-key', handleReset);
    return () => window.removeEventListener('reset-api-key', handleReset);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        // CRITICAL: Assume success immediately to mitigate race conditions
        setShowOverlay(false);
        onKeySelected();
      } catch (e) {
        console.error("Failed to open key selection:", e);
      }
    } else {
      // If the dialog can't be opened, just try to proceed if possible or show error
      console.warn("aistudio.openSelectKey is not available.");
      setShowOverlay(false);
      onKeySelected();
    }
  };

  if (checking) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1120]">
      <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full text-center shadow-[0_0_100px_rgba(139,92,246,0.15)] animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-violet-500/30 shadow-lg relative">
          <div className="absolute inset-0 bg-violet-500/10 blur-xl rounded-full"></div>
          <span className="material-icons-round text-4xl text-violet-400 relative z-10">key</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-black text-white mb-4 tracking-tight">
          Studio Access Required
        </h2>
        
        <p className="text-slate-400 mb-8 leading-relaxed text-sm md:text-base">
          To enable professional AI generation on mobile and desktop, please select a paid API key from your Google Cloud project.
        </p>
        
        <div className="bg-slate-950/50 rounded-[1.5rem] p-6 mb-8 text-left border border-slate-800/50">
          <div className="flex items-start gap-3 mb-4">
            <span className="material-icons-round text-violet-500 text-lg mt-0.5">info</span>
            <p className="text-xs md:text-sm text-slate-300 font-medium">
              A paid GCP project with billing enabled is required for high-performance models.
            </p>
          </div>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            Billing Documentation 
            <span className="material-icons-round text-xs">open_in_new</span>
          </a>
        </div>

        <Button onClick={handleSelectKey} className="w-full !py-5 shadow-2xl shadow-violet-900/40 transform hover:scale-[1.02] active:scale-[0.98]">
          <span className="font-black uppercase tracking-[0.2em] text-sm">Select API Key</span>
        </Button>
      </div>
    </div>
  );
};
