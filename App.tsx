
import React, { useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { GraphicAI } from './components/GraphicAI';
import { ContentAI } from './components/ContentAI';
import { PromptEngineer } from './components/PromptEngineer';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SettingsModal } from './components/SettingsModal';
import { AuthScreen } from './components/AuthScreen';
import { ApiKeyChecker } from './components/ApiKeyChecker';
import { useLanguage } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import { HistoryItem } from './types';
import { getStoredApiKey } from './services/geminiService';

type AppView = 'dashboard' | 'graphic' | 'content' | 'prompt';

const App: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!getStoredApiKey());
  const [view, setView] = useState<AppView>('dashboard');
  const [graphicPrompt, setGraphicPrompt] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [initialGraphicResult, setInitialGraphicResult] = useState<string>('');
  const [initialContentTopic, setInitialContentTopic] = useState<string>('');
  const [initialContentResult, setInitialContentResult] = useState<string>('');

  const { t } = useLanguage();

  // Gate the entire app behind API key entry
  if (!hasApiKey) {
    return <ApiKeyChecker onKeyReady={() => setHasApiKey(true)} />;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0b1120]">
        <div className="w-10 h-10 border-4 border-indigo-100 dark:border-violet-900/30 border-t-indigo-500 dark:border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

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
    } else if (item.type === 'text' || item.type === 'analysis') {
      setInitialContentTopic(item.prompt);
      setInitialContentResult(item.result);
      setView('content');
    }
  };

  const renderViewContent = () => {
    switch (view) {
      case 'graphic':
        return <GraphicAI initialPrompt={graphicPrompt} initialResult={initialGraphicResult} />;
      case 'content':
        return <ContentAI onRequestImageGeneration={handleGraphicNavigation} initialTopic={initialContentTopic} initialResult={initialContentResult} />;
      case 'prompt':
        return <PromptEngineer onUseInGraphic={handleGraphicNavigation} onUseInContent={handleContentNavigation} />;
      case 'dashboard':
      default:
        return (
          <div className="p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 text-center md:text-left">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 transition-colors">Welcome to Lumina</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium">Professional AI Creative Workspace</p>
              </div>
              <div className="hidden md:flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div className="text-right mr-2">
                  <p className="text-[10px] font-black uppercase text-indigo-500 dark:text-violet-400 tracking-widest leading-none mb-1">Signed In As</p>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt="user" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button onClick={() => setView('graphic')} className="group glass-card p-6 md:p-8 rounded-[2.5rem] text-left hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden flex flex-col h-64 md:h-72 bg-white dark:bg-[#0f172a]">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-indigo-500 dark:text-indigo-400 text-2xl">brush</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.graphic.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex-grow">{t('home.graphic.desc')}</p>
                <div className="mt-4 flex items-center text-indigo-500 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                  Studio <span className="material-icons-round text-sm ml-2">east</span>
                </div>
              </button>

              <button onClick={() => setView('content')} className="group glass-card p-6 md:p-8 rounded-[2.5rem] text-left hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 relative overflow-hidden flex flex-col h-64 md:h-72 bg-white dark:bg-[#0f172a]">
                <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-violet-500 dark:text-violet-400 text-2xl">edit_note</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.content.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex-grow">{t('home.content.desc')}</p>
                <div className="mt-4 flex items-center text-violet-500 dark:text-violet-400 font-bold text-[10px] uppercase tracking-widest">
                  Editor <span className="material-icons-round text-sm ml-2">east</span>
                </div>
              </button>

              <button onClick={() => setView('prompt')} className="group glass-card p-6 md:p-8 rounded-[2.5rem] text-left hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 relative overflow-hidden flex flex-col h-64 md:h-72 bg-white dark:bg-[#0f172a]">
                <div className="w-12 h-12 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-cyan-500 dark:text-cyan-400 text-2xl">psychology</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">{t('home.prompt.title')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed flex-grow">{t('home.prompt.desc')}</p>
                <div className="mt-4 flex items-center text-cyan-500 dark:text-cyan-400 font-bold text-[10px] uppercase tracking-widest">
                  Prompt Lab <span className="material-icons-round text-sm ml-2">east</span>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-indigo-500/30 overflow-hidden">
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onApiKeyReset={() => setHasApiKey(false)} />
      <HistoryDrawer onSelect={handleHistorySelection} />

      <aside className="fixed inset-y-0 left-0 w-16 md:w-60 sidebar-glass z-50 flex flex-col items-center md:items-stretch py-6 md:py-8 transition-all">
        <div className="px-4 md:px-6 mb-10 flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-600 dark:bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 dark:shadow-violet-900/40">
            <span className="material-icons-round text-xl md:text-2xl text-white">auto_awesome</span>
          </div>
          <span className="hidden md:inline text-lg font-black tracking-tighter text-slate-900 dark:text-white">Lumina <span className="text-indigo-500 dark:text-violet-400">AI</span></span>
        </div>

        <nav className="flex-1 space-y-1 md:space-y-2 px-2 md:px-3">
          {[
            { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
            { id: 'graphic', icon: 'brush', label: 'Graphic AI' },
            { id: 'content', icon: 'edit_note', label: 'Content AI' },
            { id: 'prompt', icon: 'psychology', label: 'Prompt Lab' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setView(item.id as AppView)}
              className={`w-full flex items-center gap-4 px-3 md:px-4 py-3 rounded-xl md:rounded-2xl transition-all duration-200 group ${view === item.id
                ? 'bg-indigo-600 dark:bg-violet-600 text-white shadow-xl shadow-indigo-900/20 dark:shadow-violet-900/40'
                : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-violet-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50'
                }`}
            >
              <span className="material-icons-round text-lg md:text-xl">{item.icon}</span>
              <span className="hidden md:inline font-bold text-xs tracking-wide">{item.label}</span>
              {view === item.id && <div className="ml-auto w-1 h-1 rounded-full bg-white hidden md:block"></div>}
            </button>
          ))}
        </nav>

        <div className="px-2 md:px-3 space-y-1 md:space-y-2 pt-6 border-t border-slate-100 dark:border-slate-800/50">
          <HistoryDrawer standalone />

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-4 px-3 md:px-4 py-3 rounded-xl md:rounded-2xl text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-violet-400 hover:bg-indigo-50 dark:hover:bg-slate-800/50 transition-all"
          >
            <span className="material-icons-round text-lg md:text-xl">settings</span>
            <span className="hidden md:inline font-bold text-xs tracking-wide">Settings</span>
          </button>

          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-4 px-3 md:px-4 py-3 rounded-xl md:rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
          >
            <span className="material-icons-round text-lg md:text-xl">logout</span>
            <span className="hidden md:inline font-bold text-xs tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-grow ml-16 md:ml-60 flex flex-col h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0b1120] transition-colors relative">
        <AppHeader
          title={view === 'dashboard' ? 'Overview' : t(`${view}.title`)}
        />
        <div className="flex-grow overflow-y-auto">
          {renderViewContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
