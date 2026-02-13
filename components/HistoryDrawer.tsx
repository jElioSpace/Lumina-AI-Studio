import React from 'react';
import { useHistory } from '../contexts/HistoryContext';
import { useLanguage } from '../contexts/LanguageContext';
import { HistoryItem } from '../types';

interface Props {
  onSelect?: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<Props> = ({ onSelect }) => {
  const { history, isOpen, setIsOpen, clearHistory, removeFromHistory } = useHistory();
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleItemClick = (item: HistoryItem) => {
    if (onSelect) {
      onSelect(item);
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-slate-900 border-l border-slate-800 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 backdrop-blur">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-icons-round text-violet-500">history</span>
            {t('history.title')}
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
              <span className="material-icons-round text-5xl mb-2">history_toggle_off</span>
              <p>{t('history.empty')}</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => handleItemClick(item)}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden group hover:border-violet-500/30 transition-all cursor-pointer hover:bg-slate-800 relative"
              >
                {/* Header */}
                <div className="p-3 border-b border-slate-700/30 flex justify-between items-start gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`material-icons-round text-sm ${item.type === 'image' ? 'text-fuchsia-400' : 'text-violet-400'}`}>
                       {item.type === 'image' ? 'image' : 'article'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         navigator.clipboard.writeText(item.type === 'image' ? item.result : item.result);
                       }}
                       className="text-slate-500 hover:text-white transition-colors p-1"
                       title="Copy"
                    >
                      <span className="material-icons-round text-sm">content_copy</span>
                    </button>
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         removeFromHistory(item.id);
                       }}
                       className="text-slate-500 hover:text-red-400 transition-colors p-1"
                       title="Delete"
                    >
                      <span className="material-icons-round text-sm">delete</span>
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-3">
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2 italic">"{item.prompt}"</p>
                  
                  {item.type === 'image' ? (
                    <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700/50">
                      <img src={item.result} alt="Result" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="bg-slate-900 p-2 rounded-lg border border-slate-700/50 text-xs text-slate-300 max-h-32 overflow-y-auto whitespace-pre-wrap font-mono pointer-events-none">
                      {item.result}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
            <button 
              onClick={clearHistory}
              className="w-full py-2 px-4 rounded-xl border border-red-900/30 text-red-400 hover:bg-red-900/10 transition-colors text-sm font-medium"
            >
              {t('history.clear')}
            </button>
          </div>
        )}
      </div>
    </>
  );
};