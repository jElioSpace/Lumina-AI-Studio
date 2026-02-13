
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { SettingsModal } from './SettingsModal';

interface Props {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<Props> = ({ onBack, title, subtitle }) => {
  const { t } = useLanguage();
  const { setIsOpen } = useHistory();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="w-full flex flex-col items-center justify-center pt-4 pb-3 px-2 md:pt-8 md:pb-6 md:px-0 relative border-b border-slate-800/30 mb-4 md:mb-10">
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <div className="w-full max-w-7xl flex flex-row items-center justify-between gap-2 md:gap-3">
        
        {/* Left Side: Back and Brand */}
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl bg-[#1e293b]/30 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0"
              aria-label="Go back"
            >
              <span className="material-icons-round text-lg md:text-xl">arrow_back</span>
            </button>
          )}

          <div className="flex items-center gap-2 md:gap-3 min-w-0">
             <div className="relative w-8 h-8 md:w-10 md:h-10 bg-[#1e1e2e] rounded-xl border border-slate-800/50 flex items-center justify-center shadow-lg shrink-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/10"></div>
               <span className="material-icons-round text-fuchsia-500 text-xl md:text-2xl z-10">auto_awesome</span>
             </div>
             <h1 className="text-lg md:text-2xl font-bold tracking-tight flex items-center whitespace-nowrap overflow-hidden">
                <span className="text-white hidden xs:inline">Lumina</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 ml-1.5 md:ml-2">
                  Studio
                </span>
             </h1>
          </div>
        </div>

        {/* Right Side: Tools and Settings */}
        <div className="flex items-center gap-2 shrink-0">
           <button 
              onClick={() => setIsOpen(true)}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-[#1e293b]/20 border border-slate-800 text-slate-500 hover:text-violet-400 transition-all shrink-0"
              aria-label="Open history"
           >
              <span className="material-icons-round text-lg md:text-xl">history</span>
           </button>

           <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-xl bg-[#1e293b]/20 border border-slate-800 text-slate-500 hover:text-violet-400 transition-all shrink-0"
              aria-label="Open settings"
           >
              <span className="material-icons-round text-lg md:text-xl">settings</span>
           </button>
        </div>
      </div>

      {/* Subtitle / Breadcrumb */}
      {(subtitle || title) && (
        <div className="w-full max-w-7xl mt-3 px-2">
           <div className="text-[9px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-90 truncate">
              {subtitle || title}
           </div>
        </div>
      )}
    </header>
  );
};
