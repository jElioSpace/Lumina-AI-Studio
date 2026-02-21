
import React, { useEffect, useState } from 'react';
import { Button } from './Button';

interface Props {
  onKeySelected: () => void;
}

export const ApiKeyChecker: React.FC<Props> = ({ onKeySelected }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkKeyStatus = async () => {
    if (typeof window === 'undefined' || !window.aistudio) {
      setChecking(false);
      if (process.env.API_KEY) {
        onKeySelected();
      } else {
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
    
    const handleReset = () => {
      setShowOverlay(true);
    };
    window.addEventListener('reset-api-key', handleReset);
    return () => window.removeEventListener('reset-api-key', handleReset);
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      try {
        // Trigger selection and immediately assume success to proceed (mitigates race conditions)
        window.aistudio.openSelectKey();
        setShowOverlay(false);
        onKeySelected();
      } catch (e) {
        console.error("Failed to open key selection:", e);
      }
    } else {
      setShowOverlay(false);
      onKeySelected();
    }
  };

  if (checking) return null;

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1120] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-slate-950 to-slate-950"></div>
      
      <div className="relative bg-[#111827] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-violet-500/20 shadow-xl">
          <span className="material-icons-round text-4xl text-violet-400">vpn_key</span>
        </div>
        
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
          Studio Access Required
        </h2>
        
        <p className="text-slate-400 mb-8 leading-relaxed text-sm">
          To enable professional AI generation on mobile and desktop, please select a paid API key from your Google Cloud project.
        </p>

        <div 
          onClick={handleSelectKey}
          className="w-full bg-[#030712] border border-slate-800/80 rounded-2xl py-4 px-5 text-slate-500 flex items-center justify-between cursor-pointer hover:border-violet-500/40 transition-all mb-8 group"
        >
          <div className="flex items-center gap-3">
            <span className="material-icons-round text-slate-600 group-hover:text-violet-400">vpn_key</span>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Enter API Key</span>
          </div>
          <span className="material-icons-round text-slate-700 group-hover:text-violet-400">arrow_forward</span>
        </div>
        
        <div className="space-y-4">
          <Button onClick={handleSelectKey} className="w-full !py-4 shadow-xl shadow-violet-900/20">
            <span className="font-black uppercase tracking-[0.2em] text-xs">Get Started</span>
          </Button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="block text-[10px] text-slate-500 hover:text-violet-400 font-bold uppercase tracking-widest transition-colors"
          >
            Learn about billing & limits
          </a>
        </div>
      </div>
    </div>
  );
};
