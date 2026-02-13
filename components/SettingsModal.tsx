
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleChangeKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      onClose();
      // The app will naturally use the new key on the next request
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-md bg-[#1e293b] border border-slate-700 rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <span className="material-icons-round text-violet-400">settings</span>
            Settings
          </h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="space-y-8">
          {/* Language Selection */}
          <section>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">
              Interface Language
            </label>
            <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800">
              <button 
                onClick={() => setLanguage('en')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${language === 'en' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                English (US)
              </button>
              <button 
                onClick={() => setLanguage('mm')}
                className={`py-2.5 rounded-xl text-xs font-bold transition-all ${language === 'mm' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                မြန်မာ (MM)
              </button>
            </div>
          </section>

          {/* Security / API Key */}
          <section>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">
              Security & Billing
            </label>
            <div className="bg-slate-950/30 border border-slate-800/50 rounded-2xl p-5 mb-4">
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                You are currently using your own Google AI Studio API key. This ensures high limits and billing control.
              </p>
              <Button 
                variant="outline" 
                className="w-full !py-3 !text-[10px] uppercase tracking-widest"
                icon="vpn_key"
                onClick={handleChangeKey}
              >
                Change / Reset API Key
              </Button>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            Lumina Studio v1.2.0
          </p>
        </div>
      </div>
    </div>
  );
};
