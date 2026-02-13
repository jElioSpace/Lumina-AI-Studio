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
}

export const GeneratedResultView: React.FC<Props> = ({ 
  result, 
  title, 
  onGenerateTitles, 
  onGenerateImage,
  onUpdateText 
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
        setToastMsg("Image saving...");
    } else if (text) {
        const blob = new Blob([text], { type: 'text/markdown' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `lumina-content-${Date.now()}.md`;
        link.click();
        setToastMsg("Document saved!");
    }
  };

  const handleSaveEdit = () => {
    if (onUpdateText) onUpdateText(editableText);
    setIsEditing(false);
    setToastMsg("Changes saved!");
  };

  return (
    <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] h-full flex flex-col shadow-2xl backdrop-blur-sm overflow-hidden">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-800/40 bg-slate-900/20">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
          {title}
        </h3>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-800"></div>
          <div className="w-3 h-3 rounded-full bg-slate-800"></div>
        </div>
      </div>

      <div className="flex-1 p-6 relative min-h-[450px] flex items-center justify-center bg-slate-950/20 m-4 rounded-[2rem] border border-slate-800/30 overflow-hidden shadow-inner">
        
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-md">
             <div className="w-12 h-12 border-2 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6"></div>
             <p className="text-violet-200/80 text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">{t('result.processing')}</p>
          </div>
        )}

        {!loading && !imageUrl && !text && !error && (
          <div className="text-center">
             <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-800 shadow-xl">
                <span className="material-icons-round text-3xl text-slate-700">auto_awesome</span>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{t('result.ready')}</p>
          </div>
        )}

        {error && (
           <div className="text-red-400 bg-red-950/20 p-8 rounded-[2rem] border border-red-900/20 max-w-sm text-center backdrop-blur-xl">
              <span className="material-icons-round text-4xl mb-4 text-red-500/50">error_outline</span>
              <p className="text-sm font-medium leading-relaxed">{error}</p>
           </div>
        )}

        {imageUrl && (
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <img 
              src={imageUrl} 
              alt="Generated" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
            />
          </div>
        )}

        {text && !isEditing && (
          <div className="w-full h-full overflow-y-auto p-6 text-slate-300 font-mono text-sm leading-relaxed scrollbar-hide">
            {text}
          </div>
        )}

        {text && isEditing && (
          <textarea 
            className="w-full h-full bg-transparent text-slate-300 font-mono text-sm p-6 outline-none resize-none border-none focus:ring-0"
            value={editableText}
            onChange={(e) => setEditableText(e.target.value)}
            spellCheck={false}
          />
        )}
      </div>

      {(imageUrl || text) && (
        <div className="px-8 pb-8 pt-2 flex flex-wrap gap-3">
           {text && (
             <>
               {isEditing ? (
                  <button onClick={handleSaveEdit} className="flex-1 h-12 bg-green-600/10 border border-green-500/20 hover:bg-green-600/20 text-green-400 rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="material-icons-round text-sm">save</span>
                    {t('btn.save_edit')}
                  </button>
               ) : (
                  <button onClick={() => setIsEditing(true)} className="h-12 px-6 bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-400 rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="material-icons-round text-sm">edit</span>
                    {t('btn.edit_text')}
                  </button>
               )}
               
               {!isEditing && onGenerateTitles && (
                  <button onClick={() => onGenerateTitles(text)} className="h-12 px-6 bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 text-slate-400 rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <span className="material-icons-round text-sm">auto_stories</span>
                    {t('btn.gen_titles')}
                  </button>
               )}
             </>
           )}

           <div className="flex-grow"></div>

           <button onClick={handleDownload} className="w-12 h-12 bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 text-slate-400 rounded-2xl transition-all flex items-center justify-center">
             <span className="material-icons-round text-xl">download</span>
           </button>

           <button 
             onClick={() => copyToClipboard(isEditing ? editableText : (text || imageUrl || ''))}
             className="h-12 px-8 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-violet-900/40 hover:scale-105 active:scale-95"
           >
             <span className="material-icons-round text-sm">content_copy</span>
             {t('btn.copy')}
           </button>
        </div>
      )}
    </div>
  );
};