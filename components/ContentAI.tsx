import React, { useState, useMemo, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { Button } from './Button';
import { Input, Select, TextArea, MultiFileUpload } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GeneratedResult } from '../types';
import { generateTextContent } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';

// Options Data
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
  onBack: () => void;
  onRequestImageGeneration?: (prompt: string) => void;
  initialTopic?: string;
  initialResult?: string;
}

export const ContentAI: React.FC<ContentAIProps> = ({ 
  onBack, 
  onRequestImageGeneration, 
  initialTopic, 
  initialResult 
}) => {
  const { t, language } = useLanguage();
  const { addToHistory } = useHistory();
  
  // Form State
  const [pageName, setPageName] = useState('');
  const [creatorPersona, setCreatorPersona] = useState('General');
  const [topic, setTopic] = useState(initialTopic || '');
  const [platform, setPlatform] = useState('Facebook');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [length, setLength] = useState('Medium');
  const [useEmojis, setUseEmojis] = useState(true);
  
  // References
  const [referenceUrls, setReferenceUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  
  const [additionalContext, setAdditionalContext] = useState('');
  
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  // Load initial result if provided (from History)
  useEffect(() => {
    if (initialResult) {
      setResult({ loading: false, text: initialResult });
    }
  }, [initialResult]);

  // Update topic if prop changes
  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
  }, [initialTopic]);

  // Options Memoization
  const personaOptions = useMemo(() => Object.entries(PERSONA_KEYS).map(([value, key]) => ({
    label: t(key), value
  })), [t]);

  const platformOptions = useMemo(() => Object.entries(PLATFORM_KEYS).map(([value, key]) => ({
    label: t(key), value
  })), [t]);

  const toneOptions = useMemo(() => Object.entries(TONE_KEYS).map(([value, key]) => ({
    label: t(key), value
  })), [t]);

  const lengthOptions = useMemo(() => Object.entries(LENGTH_KEYS).map(([value, key]) => ({
    label: t(key), value
  })), [t]);

  // Handlers
  const addUrl = () => {
    if (newUrl && !referenceUrls.includes(newUrl)) {
      setReferenceUrls([...referenceUrls, newUrl]);
      setNewUrl('');
    }
  };

  const removeUrl = (index: number) => {
    const updated = [...referenceUrls];
    updated.splice(index, 1);
    setReferenceUrls(updated);
  };

  const handleRandomize = () => {
    const topics = ["Future of AI in Healthcare", "5 Tips for Remote Work", "Healthy Meal Prep Ideas", "Travel Guide to Japan", "Digital Marketing Trends 2025"];
    const personas = Object.keys(PERSONA_KEYS);
    const platforms = Object.keys(PLATFORM_KEYS);
    const tones = Object.keys(TONE_KEYS);
    
    setTopic(topics[Math.floor(Math.random() * topics.length)]);
    setCreatorPersona(personas[Math.floor(Math.random() * personas.length)]);
    setPlatform(platforms[Math.floor(Math.random() * platforms.length)]);
    setTone(tones[Math.floor(Math.random() * tones.length)]);
    setTargetAudience("General Audience");
    setUseEmojis(Math.random() > 0.5);
    setPageName("Lumina Demo");
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setResult({ loading: true, text: undefined, error: undefined });
    try {
      const text = await generateTextContent({
        pageName,
        creatorPersona,
        topic,
        platform,
        targetAudience,
        tone,
        length,
        useEmojis,
        referenceUrls,
        referenceImages,
        additionalContext,
        language
      });
      setResult({ loading: false, text });
      addToHistory({ type: 'text', prompt: `${platform}: ${topic.substring(0, 30)}...`, result: text });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  const handleGenerateTitles = async (currentContent: string) => {
      setResult(prev => ({ ...prev, loading: true }));
      try {
        const text = await generateTextContent({
            pageName,
            creatorPersona,
            topic: `5 Catchy Titles for: ${topic}`,
            platform,
            targetAudience,
            tone,
            length: "Short",
            useEmojis,
            referenceUrls: [],
            referenceImages: [],
            additionalContext: `Based on this content, generate 5 catchy titles/headlines:\n\n${currentContent.substring(0, 500)}...`,
            language
        });
        
        // Append instead of replace
        setResult(prev => ({ 
          ...prev, 
          loading: false, 
          text: (prev.text || '') + "\n\n--- Generated Titles ---\n" + text 
        }));

      } catch (err: any) {
        setResult(prev => ({ ...prev, loading: false, error: err.message }));
      }
  };

  const handleImageGenerationRequest = (content: string) => {
      if (onRequestImageGeneration) {
          // Create a simple prompt from the topic and persona
          const prompt = `${topic}. Style: ${tone}. High quality, detailed representation.`;
          onRequestImageGeneration(prompt);
      }
  };

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-violet-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AppHeader onBack={onBack} title={t('content.title')} subtitle={t('content.subtitle')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4 md:mt-8">
          
          {/* Controls Column */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6 text-slate-300">
               <span className="material-icons-round text-violet-400">edit_note</span>
               <h2 className="font-semibold text-lg uppercase tracking-wide">{t('content.title')}</h2>
            </div>

            <div className="space-y-5">
              
              {/* Row 1: Page Name & Persona */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                   label={t('label.pageName')}
                   placeholder="e.g. My Brand"
                   value={pageName}
                   onChange={(e) => setPageName(e.target.value)}
                />
                <Select 
                   label={t('label.creatorPersona')}
                   options={personaOptions}
                   value={creatorPersona}
                   onChange={(e) => setCreatorPersona(e.target.value)}
                />
              </div>

              {/* Row 2: Topic */}
              <Input 
                 label={t('label.topic')}
                 placeholder="Main topic of your content..."
                 value={topic}
                 onChange={(e) => setTopic(e.target.value)}
              />

              {/* Row 3: Platform & Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select 
                   label={t('label.platform')}
                   options={platformOptions}
                   value={platform}
                   onChange={(e) => setPlatform(e.target.value)}
                 />
                 <Input 
                   label={t('label.targetAudience')}
                   placeholder="e.g. Young Adults"
                   value={targetAudience}
                   onChange={(e) => setTargetAudience(e.target.value)}
                 />
              </div>

              {/* Row 4: Tone & Length */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Select 
                   label={t('label.tone')}
                   options={toneOptions}
                   value={tone}
                   onChange={(e) => setTone(e.target.value)}
                 />
                 <Select 
                   label={t('label.length')}
                   options={lengthOptions}
                   value={length}
                   onChange={(e) => setLength(e.target.value)}
                 />
              </div>

              {/* Row 5: Emojis Toggle Switch */}
              <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                   {t('label.useEmojis')}
                 </label>
                 <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setUseEmojis(!useEmojis)}
                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${useEmojis ? 'bg-violet-600' : 'bg-slate-700'}`}
                    >
                        <span 
                            className={`block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${useEmojis ? 'translate-x-7' : 'translate-x-1'}`} 
                        />
                    </button>
                    <span className="text-sm text-slate-300">{useEmojis ? t('opt.yes') : t('opt.no')}</span>
                 </div>
              </div>

              {/* Row 6: Reference URLs */}
              <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                   {t('label.referenceUrls')}
                 </label>
                 <div className="flex gap-2 mb-3">
                   <input
                     className="flex-1 bg-slate-950/50 border-2 border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 outline-none transition-all"
                     placeholder="https://..."
                     value={newUrl}
                     onChange={(e) => setNewUrl(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && addUrl()}
                   />
                   <button 
                     onClick={addUrl}
                     className="px-4 py-2 bg-slate-800 text-violet-400 font-medium rounded-xl hover:bg-slate-700 hover:text-violet-300 transition-colors"
                   >
                     {t('btn.addUrl')}
                   </button>
                 </div>
                 {referenceUrls.length > 0 && (
                   <ul className="space-y-2">
                     {referenceUrls.map((url, idx) => (
                       <li key={idx} className="flex items-center justify-between bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700/50">
                         <span className="text-sm text-slate-300 truncate max-w-[90%]">{url}</span>
                         <button onClick={() => removeUrl(idx)} className="text-slate-500 hover:text-red-400">
                           <span className="material-icons-round text-sm">close</span>
                         </button>
                       </li>
                     ))}
                   </ul>
                 )}
              </div>

              {/* Row 7: Reference Images */}
              <div>
                 <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                   {t('label.referenceImages')}
                 </label>
                 <MultiFileUpload 
                    images={referenceImages}
                    onImagesChange={setReferenceImages}
                    maxImages={3}
                 />
              </div>

              {/* Row 8: Context */}
              <TextArea 
                label={t('label.context')} 
                placeholder="Specific instructions or notes..."
                rows={4}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
              />

              <div className="pt-4 flex flex-col gap-3">
                <Button onClick={handleGenerate} loading={result.loading} className="w-full">
                  <span className="font-bold">{t('btn.write')}</span>
                </Button>
                <Button variant="outline" onClick={handleRandomize} disabled={result.loading} className="w-full">
                   {t('btn.randomize')}
                </Button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Powered by Google Gemini 2.5 Flash Series
              </p>
            </div>
          </div>

          {/* Results Column */}
          <div className="h-full">
            <GeneratedResultView 
              result={result} 
              title={t('result.title.content')}
              onGenerateTitles={handleGenerateTitles}
              onGenerateImage={handleImageGenerationRequest}
              onUpdateText={(newText) => setResult(prev => ({ ...prev, text: newText }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};