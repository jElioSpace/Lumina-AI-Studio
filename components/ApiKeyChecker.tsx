
import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

interface Props {
  onKeyReady: () => void;
}

export const ApiKeyChecker: React.FC<Props> = ({ onKeyReady }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      setShowOverlay(false);
      onKeyReady();
    }
  }, []);

  const handleSaveKey = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError('Please enter your API key.');
      return;
    }
    if (trimmed.length < 10) {
      setError('This doesn\'t look like a valid API key.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Quick validation: try a lightweight API call
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: trimmed });
      await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: 'Reply with only the word OK',
      });

      // Key works — persist it
      setStoredApiKey(trimmed);
      setShowOverlay(false);
      onKeyReady();
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('API_KEY_INVALID') || msg.includes('PERMISSION_DENIED') || msg.includes('401') || msg.includes('403')) {
        setError('Invalid API key. Please check your key and try again.');
      } else {
        // Key might be valid but hit a different error — still save it
        setStoredApiKey(trimmed);
        setShowOverlay(false);
        onKeyReady();
      }
    } finally {
      setSaving(false);
    }
  };

  if (!showOverlay) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1120] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-slate-950 to-slate-950"></div>

      <div className="relative bg-[#111827] border border-slate-800 rounded-[2.5rem] p-8 md:p-12 max-w-md w-full text-center shadow-2xl animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-violet-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-violet-500/20 shadow-xl">
          <span className="material-icons-round text-4xl text-violet-400">vpn_key</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
          API Key Required
        </h2>

        <p className="text-slate-400 mb-6 leading-relaxed text-sm">
          Enter your Google Gemini API key to start using Lumina AI Studio. Your key is stored locally in your browser and never sent to our servers.
        </p>

        <div className="mb-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
            placeholder="AIzaSy..."
            className="w-full bg-[#030712] border border-slate-800/80 rounded-2xl py-4 px-5 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all text-sm font-mono"
          />
          {error && (
            <p className="text-red-400 text-xs mt-2 text-left px-2">{error}</p>
          )}
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleSaveKey}
            className="w-full !py-4 shadow-xl shadow-violet-900/20"
            disabled={saving}
          >
            <span className="font-black uppercase tracking-[0.2em] text-xs">
              {saving ? 'Validating...' : 'Connect & Start'}
            </span>
          </Button>

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer"
            className="block text-[10px] text-slate-500 hover:text-violet-400 font-bold uppercase tracking-widest transition-colors"
          >
            Get a free API key →
          </a>
        </div>
      </div>
    </div>
  );
};
