import React, { useState, useMemo } from 'react';
import { AppHeader } from './AppHeader';
import { Button } from './Button';
import { TextArea, Select } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GeneratedResult } from '../types';
import { craftPrompt } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

interface PromptEngineerProps {
  onBack: () => void;
  onUseInGraphic: (prompt: string) => void;
  onUseInContent: (prompt: string) => void;
}

export const PromptEngineer: React.FC<PromptEngineerProps> = ({ onBack, onUseInGraphic, onUseInContent }) => {
  const { t } = useLanguage();
  const { addToHistory } = useHistory();

  const [draft, setDraft] = useState('');
  const [complexity, setComplexity] = useState('Detailed');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  const templates = useMemo(() => [
    { value: '', label: t('opt.template.load'), instruction: '' },
    { value: 'promptWriter', label: t('temp.promptWriter'), instruction: "You are an Expert Prompt Writer. Your goal is to take a simple user idea and transform it into a highly effective, structured, and sophisticated prompt for an LLM. Use advanced prompting techniques like Persona adoption, Chain of Thought, Delimiters, and specific output format requirements. Provide a structured prompt that the user can copy and paste." },
    { value: 'code', label: t('temp.code'), instruction: "You are a world-class code refactoring expert. Your task is to analyze the provided code and REWRITE it to be modern, semantic, efficient, and highly maintainable. Do not just explain; provide the refactored code directly. Use modern best practices (ES6+, modern PHP, etc.)." },
    { value: 'linguist', label: t('temp.linguist'), instruction: "You are a professional linguist. Translate or refine text while preserving tone, cultural nuances, and idioms. Provide the output directly in the target style." },
    { value: 'writer', label: t('temp.writer'), instruction: "You are a bestselling creative storyteller. Brainstorm and develop rich narratives based on user input. Focus on sensory details and character psychology." },
    { value: 'midjourney', label: t('temp.midjourney'), instruction: "You are a Midjourney Photographer. Brainstorm and generate high-end, detailed image prompts including technical camera settings, lighting, and composition." },
    { value: 'marketing', label: t('temp.marketing'), instruction: "You are a high-conversion Marketing Copywriter. Brainstorm and write persuasive copy for the specific platform provided in the input." },
  ], [t]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTemplate(val);
    const tmpl = templates.find(t => t.value === val);
    if (tmpl) setSystemInstruction(tmpl.instruction);
  };

  const handleProcess = async () => {
    if (!draft) return;
    setResult({ loading: true });
    try {
      const isImagePersona = systemInstruction.toLowerCase().includes('photographer') || systemInstruction.toLowerCase().includes('midjourney');
      const target = isImagePersona ? 'image' : 'text';
      
      const output = await craftPrompt(draft, target, complexity, systemInstruction);
      setResult({ loading: false, text: output });
      addToHistory({ type: 'text', prompt: `Brainstorm: ${selectedTemplate || 'Custom'}`, result: output });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  const handleRandomize = () => {
    const list = templates.filter(t => t.value !== '');
    const random = list[Math.floor(Math.random() * list.length)];
    setSelectedTemplate(random.value);
    setSystemInstruction(random.instruction);
    
    const placeholders: Record<string, string> = {
      'promptWriter': 'A prompt for a travel assistant',
      'code': '<div class="old-style" style="color:red">Bad Code</div>',
      'midjourney': 'A cybernetic owl',
      'linguist': 'The early bird catches the worm',
      'writer': 'A clock that ticks backwards',
      'marketing': 'Ultra-comfortable workspace chairs',
    };
    setDraft(placeholders[random.value] || 'Input your idea...');
  };

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <AppHeader onBack={onBack} title={t('prompt.title')} subtitle={t('prompt.subtitle')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-2">
          
          <div className="bg-[#0f172a]/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-300">
               <span className="material-icons-round text-cyan-400">psychology</span>
               <h2 className="font-semibold text-lg uppercase tracking-wider">Brainstorm Studio</h2>
            </div>

            <div className="space-y-6">
               <Select 
                 label={t('label.template')}
                 value={selectedTemplate}
                 onChange={handleTemplateChange}
                 options={templates.map(t => ({ label: t.label, value: t.value }))}
               />

               <div>
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {t('label.systemInstruction')}
                    </label>
                    <span className="text-[10px] font-bold bg-[#1e293b] text-slate-500 px-2.5 py-1 rounded-md border border-slate-800">
                        {t('tag.persona')}
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-[#0b1120] border-2 border-slate-800 focus:border-cyan-500/50 rounded-2xl p-4 text-slate-200 placeholder-slate-700 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all resize-none font-mono text-xs md:text-sm leading-relaxed"
                    rows={5}
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                  />
               </div>

               <TextArea 
                 label={t('label.draft')}
                 placeholder="Input your draft, code, or idea here..."
                 rows={6}
                 value={draft}
                 onChange={(e) => setDraft(e.target.value)}
                 className="font-mono text-xs md:text-sm !bg-[#0b1120]"
               />

               <div className="grid grid-cols-1 gap-4">
                  <Select 
                    label={t('label.complexity')}
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    options={[
                        { label: t('opt.comp.concise'), value: 'Concise' },
                        { label: t('opt.comp.detailed'), value: 'Detailed' },
                        { label: t('opt.comp.cot'), value: 'Chain of Thought' }
                    ]}
                  />
               </div>

               <div className="pt-2 flex flex-col gap-3">
                  <Button 
                    onClick={handleProcess} 
                    loading={result.loading} 
                    className="w-full !bg-gradient-to-r !from-cyan-600 !to-blue-600 !hover:from-cyan-500 !hover:to-blue-500 !shadow-cyan-900/20"
                    icon="auto_fix_high"
                  >
                    <span className="font-bold uppercase tracking-wider text-sm">{t('btn.enhance')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRandomize} 
                    disabled={result.loading} 
                    className="w-full text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 border-slate-800"
                  >
                    {t('btn.randomize')}
                  </Button>
               </div>
            </div>
          </div>

          <div className="h-full flex flex-col gap-4">
            <GeneratedResultView 
               result={result}
               title={t('result.title.prompt')}
               onUpdateText={(text) => setResult(prev => ({ ...prev, text }))}
            />

            {result.text && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button 
                        onClick={() => onUseInGraphic(result.text!)}
                        className="py-3 px-4 bg-[#1e293b]/50 hover:bg-slate-800 text-fuchsia-400 border border-slate-800 rounded-xl transition-all font-bold flex items-center justify-center gap-2 group text-[11px] uppercase tracking-wider"
                    >
                        <span className="material-icons-round text-sm group-hover:scale-110 transition-transform">brush</span>
                        {t('btn.use_graphic')}
                    </button>
                    <button 
                        onClick={() => onUseInContent(result.text!)}
                        className="py-3 px-4 bg-[#1e293b]/50 hover:bg-slate-800 text-violet-400 border border-slate-800 rounded-xl transition-all font-bold flex items-center justify-center gap-2 group text-[11px] uppercase tracking-wider"
                    >
                        <span className="material-icons-round text-sm group-hover:scale-110 transition-transform">edit_note</span>
                        {t('btn.use_content')}
                    </button>
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};