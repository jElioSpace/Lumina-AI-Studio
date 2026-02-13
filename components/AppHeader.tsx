import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

interface Props {
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<Props> = ({ onBack, title, subtitle }) => {
  const { language, setLanguage, t } = useLanguage();
  const { setIsOpen } = useHistory();

  return (
    <header className="w-full flex flex-col items-center justify-center pt-5 pb-4 px-4 md:pt-8 md:pb-6 md:px-0 relative border-b border-slate-800/30 mb-6 md:mb-10">
      
      <div className="w-full max-w-7xl flex flex-row items-center justify-between gap-3">
        
        {/* Left Side: Back and Brand */}
        <div className="flex items-center gap-3 md:gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1e293b]/30 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0"
              aria-label="Go back"
            >
              <span className="material-icons-round text-xl">arrow_back</span>
            </button>
          )}

          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 bg-[#1e1e2e] rounded-xl border border-slate-800/50 flex items-center justify-center shadow-lg shrink-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-fuchsia-600/10"></div>
               <span className="material-icons-round text-fuchsia-500 text-2xl z-10">auto_awesome</span>
             </div>
             <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center whitespace-nowrap">
                <span className="text-white">Lumina</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 ml-2">
                  AI Studio
                </span>
             </h1>
          </div>
        </div>

        {/* Right Side: Language and History */}
        <div className="flex items-center gap-3">
           <div className="flex bg-[#0f172a] rounded-xl p-1 border border-slate-800/50 shadow-inner">
             <button 
               onClick={() => setLanguage('en')}
               className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'en' ? 'bg-[#1e293b] text-white shadow-md' : 'text-slate-600 hover:text-slate-400'}`}
             >
               US
             </button>
             <button 
               onClick={() => setLanguage('mm')}
               className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${language === 'mm' ? 'bg-[#1e293b] text-white shadow-md' : 'text-slate-600 hover:text-slate-400'}`}
             >
               MM
             </button>
           </div>

           <button 
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1e293b]/20 border border-slate-800 text-slate-500 hover:text-violet-400 transition-all"
              aria-label="Open history"
           >
              <span className="material-icons-round text-xl">history</span>
           </button>
        </div>
      </div>

      {/* Subtitle / Breadcrumb */}
      {(subtitle || title) && (
        <div className="w-full max-w-7xl mt-4 px-1">
           <div className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase tracking-[0.4em] opacity-90">
              {subtitle || title}
           </div>
        </div>
      )}
    </header>
  );
};