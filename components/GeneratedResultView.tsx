
import React, { useState, useEffect } from 'react';
import { GeneratedResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Toast } from './Toast';

interface Props {
  result: GeneratedResult;
  title: string;
  onGenerateTitles?: (content: string) => void;
  onGenerateImage?: (content: string) => void;
  onUpdateText?: (newText: string) => void;
  onClear?: () => void;
}

export const GeneratedResultView: React.FC<Props> = ({ 
  result, 
  title, 
  onGenerateTitles, 
  onGenerateImage,
  onUpdateText,
  onClear
}) => {
  const { imageUrl, text, error, loading } = result;
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editableText, setEditableText] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (text) setEditableText(text);
  }, [text]);

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setToastMsg("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `lumina-image-${Date.now()}.png`;
        link.click();
        setToastMsg("Saving Image...");
    } else if (text) {
        const blob = new Blob([text], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `lumina-content-${Date.now()}.md`;
        link.click();
        setToastMsg("Saving Document...");
    }
  };

  const handleSaveEdit = () => {
    if (onUpdateText) onUpdateText(editableText);
    setIsEditing(false);
    setToastMsg("Updated successfully!");
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] h-full flex flex-col shadow-sm overflow-hidden transition-colors">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-violet-500"></div>
          {title}
        </h3>
        <div className="flex gap-2">
          {(imageUrl || text || error) && onClear && !loading && (
            <button onClick={onClear} className="text-[9px] font-black text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 uppercase tracking-widest transition-colors mr-2 flex items-center gap-1">
              <span className="material-icons-round text-sm">close</span>
              {t('btn.clear_result')}
            </button>
          )}
          <div className="w-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800"></div>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-6 relative min-h-[400px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-950/30 m-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800/50 overflow-hidden transition-colors">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-colors">
             <div className="w-10 h-10 border-4 border-indigo-100 dark:border-violet-900/30 border-t-indigo-500 dark:border-t-violet-500 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-900 dark:text-white text-[9px] font-black uppercase tracking-[0.2em]">{t('result.processing')}</p>
          </div>
        )}

        {!loading && !imageUrl && !text && !error && (
          <div className="text-center opacity-40">
             <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <span className="material-icons-round text-2xl text-slate-400 dark:text-slate-600">auto_awesome</span>
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">{t('result.ready')}</p>
          </div>
        )}

        {error && (
           <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/20 max-w-sm text-center">
              <span className="material-icons-round text-2xl mb-2">error_outline</span>
              <p className="text-xs font-bold leading-relaxed">{error}</p>
           </div>
        )}

        {imageUrl && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={imageUrl} alt="Generated" className="max-w-full max-h-full object-contain rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors" />
          </div>
        )}

        {text && !isEditing && (
          <div className="w-full h-full overflow-y-auto p-4 text-slate-700 dark:text-slate-300 font-sans text-sm leading-relaxed whitespace-pre-wrap">
            {text}
          </div>
        )}

        {text && isEditing && (
          <textarea className="w-full h-full bg-transparent text-slate-800 dark:text-slate-100 font-sans text-sm p-4 outline-none resize-none border-none focus:ring-0" value={editableText} onChange={(e) => setEditableText(e.target.value)} spellCheck={false} />
        )}
      </div>

      {(imageUrl || text) && (
        <div className="px-8 pb-8 pt-2 flex flex-wrap gap-2">
           {text && (
             <>
               {isEditing ? (
                  <button onClick={handleSaveEdit} className="flex-1 h-11 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl transition-all flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <span className="material-icons-round text-sm">done</span>
                    Save
                  </button>
               ) : (
                  <button onClick={() => setIsEditing(true)} className="h-11 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <span className="material-icons-round text-sm">edit</span>
                    {t('btn.edit_text')}
                  </button>
               )}
             </>
           )}

           <div className="flex-grow"></div>

           <button onClick={handleDownload} className="w-11 h-11 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl transition-all flex items-center justify-center" title="Download">
             <span className="material-icons-round text-xl">download</span>
           </button>

           <button 
             onClick={() => copyToClipboard(isEditing ? editableText : (text || imageUrl || ''))}
             className="h-11 px-8 bg-slate-900 dark:bg-violet-600 text-white rounded-xl transition-all flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 dark:shadow-violet-900/20 hover:bg-slate-800 dark:hover:bg-violet-500"
           >
             <span className="material-icons-round text-sm">content_copy</span>
             {t('btn.copy')}
           </button>
        </div>
      )}
    </div>
  );
};
