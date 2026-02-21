
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-950/40 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-[340px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/50 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] p-6 md:p-8 animate-in zoom-in slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between mb-8 px-2">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2 opacity-80 transition-colors">
            <span className="material-icons-round text-lg text-indigo-500 dark:text-indigo-400">tune</span>
            Preferences
          </h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
          >
            <span className="material-icons-round text-lg">close</span>
          </button>
        </div>

        <div className="space-y-10">
          {/* Interface Language */}
          <section>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">
              Interface Language
            </label>
            <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-full border border-slate-200 dark:border-slate-800/50 transition-colors">
              <button 
                onClick={() => setLanguage('en')}
                className={`flex-1 py-3 rounded-full text-[11px] font-bold transition-all duration-300 ${language === 'en' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                English (US)
              </button>
              <button 
                onClick={() => setLanguage('mm')}
                className={`flex-1 py-3 rounded-full text-[11px] font-bold transition-all duration-300 ${language === 'mm' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
              >
                မြန်မာ (MM)
              </button>
            </div>
          </section>

          {/* Appearance */}
          <section>
            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4 ml-4">
              Appearance
            </label>
            <div className="flex bg-slate-100 dark:bg-black/40 p-1.5 rounded-full border border-slate-200 dark:border-slate-800/50 transition-colors">
              <button 
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[11px] font-bold transition-all duration-300 ${theme === 'light' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <span className="material-icons-round text-sm">light_mode</span>
                Light
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[11px] font-bold transition-all duration-300 ${theme === 'dark' ? 'bg-[#7c3aed] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <span className="material-icons-round text-sm">dark_mode</span>
                Dark
              </button>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/50 text-center">
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
            Lumina Studio v1.2.0
          </p>
        </div>
      </div>
    </div>
  );
};
