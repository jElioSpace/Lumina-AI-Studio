import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { GraphicAI } from './components/GraphicAI';
import { ContentAI } from './components/ContentAI';
import { PromptEngineer } from './components/PromptEngineer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { useLanguage } from './contexts/LanguageContext';
import { HistoryItem } from './types';

type AppView = 'home' | 'graphic' | 'content' | 'prompt';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [graphicPrompt, setGraphicPrompt] = useState<string>('');
  const [isKeySelected, setIsKeySelected] = useState(false);
  
  // State for re-hydrating from History
  const [initialGraphicResult, setInitialGraphicResult] = useState<string>('');
  const [initialContentTopic, setInitialContentTopic] = useState<string>('');
  const [initialContentResult, setInitialContentResult] = useState<string>('');

  const { t } = useLanguage();

  const handleGraphicNavigation = (prompt: string) => {
    setInitialGraphicResult('');
    setGraphicPrompt(prompt);
    setView('graphic');
  };

  const handleContentNavigation = (topic: string) => {
     setInitialContentResult('');
     setInitialContentTopic(topic);
     setView('content');
  };

  const handleHistorySelection = (item: HistoryItem) => {
    if (item.type === 'image') {
      setGraphicPrompt(item.prompt);
      setInitialGraphicResult(item.result);
      setView('graphic');
    } else {
      setInitialContentTopic(item.prompt);
      setInitialContentResult(item.result);
      setView('content');
    }
  };

  const renderContent = () => {
    if (view === 'graphic') {
      return (
        <GraphicAI 
          onBack={() => setView('home')} 
          initialPrompt={graphicPrompt}
          initialResult={initialGraphicResult}
        />
      );
    }

    if (view === 'content') {
      return (
        <ContentAI 
          onBack={() => setView('home')} 
          onRequestImageGeneration={handleGraphicNavigation}
          initialTopic={initialContentTopic}
          initialResult={initialContentResult}
        />
      );
    }

    if (view === 'prompt') {
      return (
        <PromptEngineer 
          onBack={() => setView('home')}
          onUseInGraphic={handleGraphicNavigation}
          onUseInContent={handleContentNavigation}
        />
      );
    }

    return (
      <div className="flex-grow flex flex-col items-center justify-center -mt-10 md:-mt-20">
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl py-6">
           
           {/* Content AI Card */}
           <button 
             onClick={() => setView('content')}
             className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-900/20 text-left overflow-hidden h-72 md:h-80 flex flex-col"
           >
              <div className="absolute top-0 right-0 p-32 bg-violet-600/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-violet-600/20"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <span className="material-icons-round text-3xl text-violet-400">edit_note</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">{t('home.content.title')}</h3>
                <p className="text-slate-400 font-light text-sm line-clamp-2 md:line-clamp-none">{t('home.content.desc')}</p>
                <div className="mt-auto pt-4 flex items-center text-violet-400 font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
                  <span className="text-sm">Open Workspace</span>
                  <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                </div>
              </div>
           </button>

           {/* Graphic AI Card */}
           <button 
             onClick={() => setView('graphic')}
             className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-fuchsia-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-fuchsia-900/20 text-left overflow-hidden h-72 md:h-80 flex flex-col"
           >
              <div className="absolute top-0 right-0 p-32 bg-fuchsia-600/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-fuchsia-600/20"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <span className="material-icons-round text-3xl text-fuchsia-400">brush</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">{t('home.graphic.title')}</h3>
                <p className="text-slate-400 font-light text-sm line-clamp-2 md:line-clamp-none">{t('home.graphic.desc')}</p>
                <div className="mt-auto pt-4 flex items-center text-fuchsia-400 font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
                  <span className="text-sm">Open Workspace</span>
                  <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                </div>
              </div>
           </button>

           {/* Prompt Engineer Card */}
           <button 
             onClick={() => setView('prompt')}
             className="group relative bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-900/20 text-left overflow-hidden h-72 md:h-80 flex flex-col"
           >
              <div className="absolute top-0 right-0 p-32 bg-cyan-600/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-cyan-600/20"></div>
              <div className="relative z-10 flex-1 flex flex-col">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <span className="material-icons-round text-3xl text-cyan-400">psychology</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-100 mb-2">{t('home.prompt.title')}</h3>
                <p className="text-slate-400 font-light text-sm line-clamp-2 md:line-clamp-none">{t('home.prompt.desc')}</p>
                <div className="mt-auto pt-4 flex items-center text-cyan-400 font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity translate-y-0 md:translate-y-2 md:group-hover:translate-y-0">
                  <span className="text-sm">Open Workspace</span>
                  <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                </div>
              </div>
           </button>

         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen font-sans selection:bg-violet-500/30 flex flex-col relative overflow-hidden bg-[#0b1120]">
      <ApiKeyChecker onKeySelected={() => setIsKeySelected(true)} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 w-full flex-grow flex flex-col">
        {view === 'home' && <AppHeader subtitle={t('app.subtitle')} />}
        {renderContent()}
        
        <footer className="w-full py-8 mt-auto flex flex-col items-center justify-center gap-2 border-t border-slate-800/30">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 flex items-center gap-2">
            Powered by <span className="text-slate-400">jElio</span> ⚡
          </p>
        </footer>
      </div>
      <HistoryDrawer onSelect={handleHistorySelection} />
    </div>
  );
};

export default App;