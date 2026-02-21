
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './Button';
import { TextArea, Select, MultiFileUpload } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GeneratedResult } from '../types';
import { craftPrompt } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

interface PromptEngineerProps {
  onUseInGraphic: (prompt: string) => void;
  onUseInContent: (prompt: string) => void;
}

const STORAGE_KEY = 'lumina_prompt_state';

export const PromptEngineer: React.FC<PromptEngineerProps> = ({ onUseInGraphic, onUseInContent }) => {
  const { t } = useLanguage();
  const { addToHistory } = useHistory();

  const [draft, setDraft] = useState('');
  const [complexity, setComplexity] = useState('Detailed');
  const [systemInstruction, setSystemInstruction] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setDraft(state.draft || '');
        setComplexity(state.complexity || 'Detailed');
        setSystemInstruction(state.systemInstruction || '');
        setSelectedTemplate(state.selectedTemplate || '');
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const state = { draft, complexity, systemInstruction, selectedTemplate };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [draft, complexity, systemInstruction, selectedTemplate]);

  const templates = useMemo(() => [
    { value: '', label: t('opt.template.load'), instruction: '' },
    { value: 'promptWriter', label: t('temp.promptWriter'), instruction: "Expert Prompt Architect persona..." },
    { value: 'code', label: t('temp.code'), instruction: "Code Refactor Specialist..." },
    { value: 'midjourney', label: t('temp.midjourney'), instruction: "Professional Photographer..." }
  ], [t]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedTemplate(val);
    const tmpl = templates.find(t => t.value === val);
    if (tmpl) setSystemInstruction(tmpl.instruction);
  };

  const handleProcess = async () => {
    if (!draft && referenceImages.length === 0) return;
    setResult({ loading: true });
    try {
      const output = await craftPrompt(draft, 'text', complexity, systemInstruction, referenceImages);
      setResult({ loading: false, text: output });
      addToHistory({ type: 'text', prompt: `Lab: ${selectedTemplate || 'Custom'}`, result: output });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  return (
    <div className="flex-grow p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-8 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select label={t('label.template')} value={selectedTemplate} onChange={handleTemplateChange} options={templates.map(t => ({ label: t.label, value: t.value }))} icon="auto_awesome_motion" />
            <Select label={t('label.complexity')} value={complexity} onChange={e => setComplexity(e.target.value)} options={[{label: t('opt.comp.concise'), value:'Concise'}, {label: t('opt.comp.detailed'), value:'Detailed'}]} icon="layers" />
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50">
            <TextArea label={t('label.systemInstruction')} rows={4} value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} placeholder="Define the AI persona and constraints..." />
          </div>

          <div className="relative group">
            <TextArea 
              label={t('label.draft')} 
              placeholder="Paste your ideas or draft here..." 
              rows={6} 
              value={draft} 
              onChange={e => setDraft(e.target.value)} 
              className="!p-6 text-base"
            />
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50">
            <MultiFileUpload images={referenceImages} onImagesChange={setReferenceImages} maxImages={3} />
          </div>
          
          <div className="pt-6">
            <Button onClick={handleProcess} loading={result.loading} className="w-full !py-5 shadow-2xl shadow-indigo-500/20 dark:shadow-violet-900/30 !rounded-3xl">
              <div className="flex items-center justify-center gap-3">
                <span className="material-icons-round text-xl">psychology</span>
                <span className="font-black uppercase tracking-[0.25em] text-sm">{t('btn.enhance')}</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="h-full flex flex-col gap-4">
          <GeneratedResultView result={result} title={t('result.title.prompt')} onClear={() => setResult({ loading: false })} onUpdateText={t => setResult(p => ({...p, text: t}))} />
          {result.text && (
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 border-indigo-200 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800" icon="brush" onClick={() => onUseInGraphic(result.text!)}>{t('btn.use_graphic')}</Button>
              <Button variant="outline" className="flex-1 border-violet-200 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-slate-800" icon="edit_note" onClick={() => onUseInContent(result.text!)}>{t('btn.use_content')}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
