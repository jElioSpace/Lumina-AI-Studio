import React, { useEffect, useState } from 'react';
import { Button } from './Button';

export const ApiKeyChecker: React.FC<{ onKeySelected: () => void }> = ({ onKeySelected }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);

  const checkKey = async () => {
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      try {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
        if (selected) {
          onKeySelected();
        }
      } catch (e) {
        console.error("Error checking API key status", e);
      }
    }
    setChecking(false);
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Assume success or re-check immediately
      await checkKey();
      // Force success state if check fails due to race condition as per guidelines
      setHasKey(true);
      onKeySelected();
    }
  };

  if (checking) return null; // Or a small loader

  if (hasKey) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="w-16 h-16 bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-violet-400">
          <span className="material-icons-round text-3xl">vpn_key</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">API Key Required</h2>
        <p className="text-slate-400 mb-6">
          To use high-quality Generation and Analysis models (Gemini 3.0 Pro), you need to select a paid API key from your Google Cloud project.
        </p>
        
        <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-sm text-left border border-slate-700">
          <p className="text-slate-300 mb-2"><strong>Note:</strong> Billing must be enabled on your project.</p>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="text-violet-400 hover:text-violet-300 underline flex items-center gap-1"
          >
            Read Billing Documentation 
            <span className="material-icons-round text-xs">open_in_new</span>
          </a>
        </div>

        <Button onClick={handleSelectKey} className="w-full">
          Select API Key
        </Button>
      </div>
    </div>
  );
};
