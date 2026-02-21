
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './Button';
import { Input, Select, TextArea, MultiFileUpload } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GeneratedResult } from '../types';
import { generateTextContent } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

const PERSONA_KEYS = {
  'General': 'persona.general',
  'Tech Expert': 'persona.tech',
  'Fitness Guru': 'persona.fitness',
  'Business Consultant': 'persona.business',
  'Creative Writer': 'persona.creative',
  'Digital Marketer': 'persona.marketer',
  'Influencer': 'persona.influencer',
  'Academic': 'persona.academic',
};

const PLATFORM_KEYS = {
  'Facebook': 'plat.facebook',
  'Instagram': 'plat.instagram',
  'Twitter/X': 'plat.twitter',
  'LinkedIn': 'plat.linkedin',
  'Blog Post': 'plat.blog',
  'Email': 'plat.email',
  'YouTube': 'plat.youtube',
  'TikTok': 'plat.tiktok',
};

const TONE_KEYS = {
  'Professional': 'tone.pro',
  'Casual': 'tone.casual',
  'Witty': 'tone.witty',
  'Urgent': 'tone.urgent',
  'Empathetic': 'tone.empathetic',
  'Educational': 'tone.educational',
  'Inspiring': 'tone.inspiring',
};

const LENGTH_KEYS = {
  'Short': 'len.short',
  'Medium': 'len.medium',
  'Long': 'len.long',
};

interface ContentAIProps {
  onRequestImageGeneration?: (prompt: string) => void;
  initialTopic?: string;
  initialResult?: string;
}

const STORAGE_KEY = 'lumina_content_state';

export const ContentAI: React.FC<ContentAIProps> = ({ 
  onRequestImageGeneration, 
  initialTopic, 
  initialResult 
}) => {
  const { t, language } = useLanguage();
  const { addToHistory } = useHistory();
  
  const [pageName, setPageName] = useState('');
  const [creatorPersona, setCreatorPersona] = useState('General');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Facebook');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [useEmojis, setUseEmojis] = useState(true);
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [additionalContext, setAdditionalContext] = useState('');
  
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setPageName(state.pageName || '');
        setCreatorPersona(state.creatorPersona || 'General');
        setTopic(state.topic || '');
        setPlatform(state.platform || 'Facebook');
        setTargetAudience(state.targetAudience || '');
        setTone(state.tone || 'Professional');
        setLength(state.length || 'Medium');
        setUseEmojis(state.useEmojis ?? true);
        setReferenceUrls(state.referenceUrls || []);
        setReferenceImages(state.referenceImages || []);
        setAdditionalContext(state.additionalContext || '');
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const state = {
      pageName, creatorPersona, topic, platform, targetAudience, tone, length,
      useEmojis, referenceUrls, referenceImages, additionalContext
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    pageName, creatorPersona, topic, platform, targetAudience, tone, length,
    useEmojis, referenceUrls, referenceImages, additionalContext
  ]);

  useEffect(() => { if (initialResult) setResult({ loading: false, text: initialResult }); }, [initialResult]);
  useEffect(() => { if (initialTopic) setTopic(initialTopic); }, [initialTopic]);

  const personaOptions = useMemo(() => Object.entries(PERSONA_KEYS).map(([value, key]) => ({ label: t(key), value })), [t]);
  const platformOptions = useMemo(() => Object.entries(PLATFORM_KEYS).map(([value, key]) => ({ label: t(key), value })), [t]);
  const toneOptions = useMemo(() => Object.entries(TONE_KEYS).map(([value, key]) => ({ label: t(key), value })), [t]);
  const lengthOptions = useMemo(() => Object.entries(LENGTH_KEYS).map(([value, key]) => ({ label: t(key), value })), [t]);

  const handleGenerate = async () => {
    if (!topic) return;
    setResult({ loading: true, text: undefined, error: undefined });
    try {
      const text = await generateTextContent({
        pageName, creatorPersona, topic, platform, targetAudience, tone, length, useEmojis, referenceUrls, referenceImages, additionalContext, language
      });
      setResult({ loading: false, text });
      addToHistory({ type: 'text', prompt: `${platform}: ${topic.substring(0, 30)}...`, result: text });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  return (
    <div className="flex-grow p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm space-y-8 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label={t('label.pageName')} placeholder="Brand Name" value={pageName} onChange={(e) => setPageName(e.target.value)} />
            <Select label={t('label.creatorPersona')} options={personaOptions} value={creatorPersona} onChange={(e) => setCreatorPersona(e.target.value)} />
          </div>

          <div className="relative group">
            <Input 
              label={t('label.topic')} 
              placeholder="What is your main message?" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)} 
              className="!py-5 !px-6 text-base font-medium"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Select label={t('label.platform')} options={platformOptions} value={platform} onChange={(e) => setPlatform(e.target.value)} icon="devices" />
             <Input label={t('label.targetAudience')} placeholder="e.g. Entrepreneurs" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Select label={t('label.tone')} options={toneOptions} value={tone} onChange={(e) => setTone(e.target.value)} icon="mood" />
             <Select label={t('label.length')} options={lengthOptions} value={length} onChange={(e) => setLength(e.target.value)} icon="segment" />
          </div>

          <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50">
            <TextArea label={t('label.context')} placeholder="Any specific requirements or keywords?" rows={4} value={additionalContext} onChange={(e) => setAdditionalContext(e.target.value)} />
          </div>

          <div className="pt-6">
            <Button onClick={handleGenerate} loading={result.loading} className="w-full !py-5 shadow-2xl shadow-indigo-500/20 dark:shadow-violet-900/30 !rounded-3xl">
              <div className="flex items-center justify-center gap-3">
                <span className="material-icons-round text-xl">edit_note</span>
                <span className="font-black uppercase tracking-[0.25em] text-sm">{t('btn.write')}</span>
              </div>
            </Button>
          </div>
        </div>

        <div className="h-full">
          <GeneratedResultView 
            result={result} 
            title={t('result.title.content')}
            onUpdateText={(newText) => setResult(prev => ({ ...prev, text: newText }))}
          />
        </div>
      </div>
    </div>
  );
};
