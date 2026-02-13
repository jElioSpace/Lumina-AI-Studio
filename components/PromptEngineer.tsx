import React, { useState, useMemo, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { Button } from './Button';
import { TextArea, Select, MultiFileUpload } from './InputControls';
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

const STORAGE_KEY = 'lumina_prompt_state';

export const PromptEngineer: React.FC<PromptEngineerProps> = ({ onBack, onUseInGraphic, onUseInContent }) => {
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
      addToHistory({ type: 'text', prompt: `Brainstorm: ${selectedTemplate || 'Custom'}`, result: output });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-0">
        <AppHeader onBack={onBack} title={t('prompt.title')} subtitle={t('prompt.subtitle')} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="space-y-6">
              <Select label={t('label.template')} value={selectedTemplate} onChange={handleTemplateChange} options={templates.map(t => ({ label: t.label, value: t.value }))} />
              <TextArea label={t('label.systemInstruction')} rows={4} value={systemInstruction} onChange={e => setSystemInstruction(e.target.value)} />
              <TextArea label={t('label.draft')} placeholder="Input your draft or idea..." rows={6} value={draft} onChange={e => setDraft(e.target.value)} />
              <MultiFileUpload images={referenceImages} onImagesChange={setReferenceImages} maxImages={3} />
              <Select label={t('label.complexity')} value={complexity} onChange={e => setComplexity(e.target.value)} options={[{label: t('opt.comp.concise'), value:'Concise'}, {label: t('opt.comp.detailed'), value:'Detailed'}]} />
              <Button onClick={handleProcess} loading={result.loading} className="w-full">{t('btn.enhance')}</Button>
            </div>
          </div>
          <div className="h-full flex flex-col gap-4">
            <GeneratedResultView result={result} title={t('result.title.prompt')} onClear={() => setResult({ loading: false })} onUpdateText={t => setResult(p => ({...p, text: t}))} />
            {result.text && (
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" icon="brush" onClick={() => onUseInGraphic(result.text!)}>{t('btn.use_graphic')}</Button>
                <Button variant="outline" className="flex-1" icon="edit_note" onClick={() => onUseInContent(result.text!)}>{t('btn.use_content')}</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
