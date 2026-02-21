
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  title?: string;
}

export const AppHeader: React.FC<Props> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-4 flex items-center justify-between transition-colors duration-300">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-0.5">
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Studio</span>
          <span className="material-icons-round text-[10px]">chevron_right</span>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-violet-400 brightness-110">{title || 'Dashboard'}</span>
        </div>
        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none transition-colors">
          {title || 'Dashboard'}
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center bg-slate-100 dark:bg-slate-900/50 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-800 transition-colors">
           <span className="material-icons-round text-slate-400 dark:text-slate-500 text-lg mr-2">search</span>
           <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-xs font-medium text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 w-24 md:w-32" />
        </div>

        <button 
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-violet-400 transition-all shadow-sm"
          title="Toggle Theme"
        >
          <span className="material-icons-round text-lg">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
        </button>
      </div>
    </header>
  );
};
