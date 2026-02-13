import React, { useState, useMemo } from 'react';
import { AppHeader } from './AppHeader';
import { Button } from './Button';
import { TextArea, Select } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GeneratedResult } from '../types';
import { craftPrompt } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

interface PromptCraftProps {
  onBack: () => void;
  onUseInGraphic: (prompt: string) => void;
  onUseInContent: (prompt: string) => void;
}

export const PromptCraft: React.FC<PromptCraftProps> = ({ onBack, onUseInGraphic, onUseInContent }) => {
  const { t } = useLanguage();
  const { addToHistory } = useHistory();

  const [draft, setDraft] = useState('');
  const [target, setTarget] = useState<'image' | 'text'>('image');
  const [complexity, setComplexity] = useState('Detailed');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  const templates = useMemo(() => [
    { value: '', label: t('opt.template.load'), instruction: '', defaultTarget: 'text' },
    { value: 'code', label: t('temp.code'), instruction: "You are a Clean Code expert. Your task is to refactor the provided code to be more readable, efficient, and maintainable. Follow SOLID principles and explain your changes.", defaultTarget: 'text' },
    { value: 'linguist', label: t('temp.linguist'), instruction: "You are a professional linguist and translator. Your goal is to translate text preserving the original tone, cultural nuances, and idioms. Do not translate literally if it loses meaning; translate for the target audience.", defaultTarget: 'text' },
    { value: 'writer', label: t('temp.writer'), instruction: "You are a bestselling creative fiction writer. Write with evocative language, strong sensory details, and deep character psychology. Show, don't tell.", defaultTarget: 'text' },
    { value: 'midjourney', label: t('temp.midjourney'), instruction: "Act as a professional photographer using a high-end camera. Focus on lighting, composition, camera lens specifications, and hyper-realistic details. Keywords: 8k, photorealistic, cinematic lighting.", defaultTarget: 'image' },
    { value: 'marketing', label: t('temp.marketing'), instruction: "You are a world-class copywriter. Write persuasive, high-converting copy that addresses pain points and desires. Use psychological triggers like urgency and social proof.", defaultTarget: 'text' },
  ], [t]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTemplate(val);
    const tmpl = templates.find(t => t.value === val);
    if (tmpl) {
      setSystemInstruction(tmpl.instruction);
      if (tmpl.defaultTarget) {
          setTarget(tmpl.defaultTarget as 'image' | 'text');
      }
    }
  };

  const handleEnhance = async () => {
    if (!draft) return;
    setResult({ loading: true });
    try {
      const enhancedText = await craftPrompt(draft, target, complexity, systemInstruction);
      setResult({ loading: false, text: enhancedText });
      addToHistory({ type: 'text', prompt: `Prompt Craft: ${draft.substring(0, 20)}...`, result: enhancedText });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  const handleRandomize = () => {
    const randomTemplate = templates[Math.floor(Math.random() * (templates.length - 1)) + 1]; // Skip empty first option
    if (randomTemplate) {
        setSelectedTemplate(randomTemplate.value);
        setSystemInstruction(randomTemplate.instruction);
        setTarget(randomTemplate.defaultTarget as 'image' | 'text');
        
        // Generic drafts based on target
        const drafts = randomTemplate.defaultTarget === 'image' 
            ? ["A cat in space", "Cyberpunk city street", "A serene lake at sunset"]
            : ["Explain quantum physics to a 5 year old", "Write a poem about rain", "Refactor this python loop"];
        
        setDraft(drafts[Math.floor(Math.random() * drafts.length)]);
    }
  };

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AppHeader onBack={onBack} title={t('prompt.title')} subtitle={t('prompt.title')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-8">
          
          {/* Controls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-300">
               <span className="material-icons-round text-cyan-400">psychology</span>
               <h2 className="font-semibold text-lg uppercase tracking-wide">{t('prompt.title')}</h2>
            </div>

            <div className="space-y-6">
               <Select 
                 label={t('label.template')}
                 value={selectedTemplate}
                 onChange={handleTemplateChange}
                 options={templates.map(t => ({ label: t.label, value: t.value }))}
               />

               {/* System Instruction Box */}
               <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {t('label.systemInstruction')}
                    </label>
                    <span className="text-[10px] font-bold bg-cyan-900/30 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/50">
                        {t('tag.persona')}
                    </span>
                  </div>
                  <textarea
                    className="w-full bg-slate-950/50 border-2 border-slate-800 focus:border-cyan-500/50 rounded-2xl p-4 text-cyan-100 placeholder-slate-600 focus:ring-1 focus:ring-cyan-500/20 outline-none transition-all resize-none font-mono text-sm leading-relaxed"
                    rows={4}
                    value={systemInstruction}
                    onChange={(e) => setSystemInstruction(e.target.value)}
                  />
               </div>

               <TextArea 
                 label={t('label.draft')}
                 placeholder="e.g. A cat sitting on a wall..."
                 rows={4}
                 value={draft}
                 onChange={(e) => setDraft(e.target.value)}
               />

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select 
                    label={t('label.target')}
                    value={target}
                    onChange={(e) => setTarget(e.target.value as 'image' | 'text')}
                    options={[
                        { label: t('opt.imageGen'), value: 'image' },
                        { label: t('opt.textGen'), value: 'text' }
                    ]}
                  />
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

               <div className="pt-4 flex flex-col gap-3">
                  <Button 
                    onClick={handleEnhance} 
                    loading={result.loading} 
                    className="w-full !bg-gradient-to-r !from-cyan-600 !to-blue-600 !hover:from-cyan-500 !hover:to-blue-500 !shadow-cyan-900/20"
                    icon="auto_fix_high"
                  >
                    <span className="font-bold">{t('btn.enhance')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRandomize} 
                    disabled={result.loading} 
                    className="w-full"
                  >
                    {t('btn.randomize')}
                  </Button>
               </div>
            </div>
          </div>

          {/* Results */}
          <div className="h-full flex flex-col gap-4">
            <GeneratedResultView 
               result={result}
               title={t('result.title.prompt')}
               onUpdateText={(text) => setResult(prev => ({ ...prev, text }))}
            />

            {result.text && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {target === 'image' && (
                        <button 
                          onClick={() => onUseInGraphic(result.text!)}
                          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-fuchsia-400 border border-slate-700 rounded-xl transition-all font-medium flex items-center justify-center gap-2 group"
                        >
                            <span className="material-icons-round group-hover:scale-110 transition-transform">brush</span>
                            {t('btn.use_graphic')}
                        </button>
                    )}
                    {target === 'text' && (
                        <button 
                           onClick={() => onUseInContent(result.text!)}
                           className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-violet-400 border border-slate-700 rounded-xl transition-all font-medium flex items-center justify-center gap-2 group"
                        >
                             <span className="material-icons-round group-hover:scale-110 transition-transform">edit_note</span>
                             {t('btn.use_content')}
                        </button>
                    )}
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};