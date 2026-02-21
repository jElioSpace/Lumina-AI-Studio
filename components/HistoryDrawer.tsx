
import React from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { useLanguage } from '../contexts/LanguageContext';
import { HistoryItem } from '../types';

interface Props {
  onSelect?: (item: HistoryItem) => void;
  standalone?: boolean;
}

export const HistoryDrawer: React.FC<Props> = ({ onSelect, standalone }) => {
  const { history, isOpen, setIsOpen, clearHistory, removeFromHistory } = useHistory();
  const { t } = useLanguage();

  const handleItemClick = (item: HistoryItem) => {
    if (onSelect) {
      onSelect(item);
      setIsOpen(false);
    }
  };

  if (standalone) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-violet-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all"
      >
        <span className="material-icons-round text-xl">history</span>
        <span className="hidden md:inline font-bold text-xs tracking-wide">{t('btn.history')}</span>
        {history.length > 0 && <span className="ml-auto bg-indigo-600 text-[9px] text-white px-1.5 py-0.5 rounded-full hidden md:block">{history.length}</span>}
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-950/40 dark:bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />

      <div className="fixed inset-y-4 right-4 w-[calc(100%-2rem)] md:w-[400px] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl z-[101] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="material-icons-round text-indigo-500 dark:text-violet-400">history</span>
            {t('history.title')}
          </h2>
          <button onClick={() => setIsOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-700">
              <span className="material-icons-round text-6xl mb-4">history_toggle_off</span>
              <p className="font-bold text-sm uppercase tracking-widest">{t('history.empty')}</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden group hover:border-indigo-500/50 dark:hover:border-violet-500/50 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-violet-500/5 transition-all duration-300 cursor-pointer relative"
              >
                <div className="p-4 flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${item.type === 'image' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500' : 'bg-violet-50 dark:bg-violet-900/30 text-violet-500'}`}>
                        <span className="material-icons-round text-sm">
                           {item.type === 'image' ? 'image' : 'article'}
                        </span>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        {new Date(item.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-bold line-clamp-2 leading-relaxed mb-3">
                      {item.prompt}
                    </p>
                  </div>
                  <button 
                     onClick={(e) => { e.stopPropagation(); removeFromHistory(item.id); }}
                     className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-300 dark:text-slate-700 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-icons-round text-lg">delete_outline</span>
                  </button>
                </div>
                
                <div className="px-4 pb-4">
                  {item.type === 'image' ? (
                    <div className="aspect-video bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-violet-900/50 transition-colors">
                      <img src={item.result} alt="History" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 max-h-32 overflow-hidden font-medium leading-relaxed group-hover:border-violet-100 dark:group-hover:border-violet-900/50 transition-colors">
                      {item.result}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            <button onClick={clearHistory} className="w-full py-3 px-4 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/30 transition-all text-xs font-black uppercase tracking-widest">
              {t('history.clear')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};
