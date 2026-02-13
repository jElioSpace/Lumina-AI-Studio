import React, { useState, useMemo, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { Button } from './Button';
import { TextArea, Select, FileUpload, MultiFileUpload, Input } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GenerationMode, GeneratedResult, SimplePostCTA } from '../types';
import { generateImage, editImage, analyzeImage, generateSimpleSocialPost, generateCollage } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { STYLE_HIERARCHY, MOOD_MAP, LIGHTING_MAP } from '../constants';

interface GraphicAIProps {
  onBack: () => void;
  initialPrompt?: string;
  initialResult?: string;
}

export const GraphicAI: React.FC<GraphicAIProps> = ({ onBack, initialPrompt, initialResult }) => {
  const { t, language } = useLanguage();
  const { addToHistory } = useHistory();
  const [activeTab, setActiveTab] = useState<GenerationMode>(GenerationMode.Generate);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  
  const [genPrompt, setGenPrompt] = useState(initialPrompt || '');
  const [genMainStyle, setGenMainStyle] = useState('None');
  const [genSubStyle, setGenSubStyle] = useState('None');
  const [genMood, setGenMood] = useState('None');
  const [genLighting, setGenLighting] = useState('Natural');
  const [genCamera, setGenCamera] = useState('None');
  const [genColor, setGenColor] = useState('None');
  const [genNegativePrompt, setGenNegativePrompt] = useState('');
  const [genSeed, setGenSeed] = useState<string>(''); 
  const [genSize, setGenSize] = useState<string>('16:9');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [collageLayout, setCollageLayout] = useState('Balanced Grid');
  const [collageTheme, setCollageTheme] = useState('Clean Minimalist');
  const [collagePrompt, setCollagePrompt] = useState('');

  const [simpleLogo, setSimpleLogo] = useState<string | null>(null);
  const [simpleHeadline, setSimpleHeadline] = useState('');
  const [simpleTagline, setSimpleTagline] = useState('');
  const [simpleContent, setSimpleContent] = useState('');
  const [simpleCtas, setSimpleCtas] = useState<SimplePostCTA[]>([{ type: 'phone', value: '' }]);

  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editMood, setEditMood] = useState('None');
  const [editSize, setEditSize] = useState('original'); 
  const [analyzePrompt, setAnalyzePrompt] = useState('');
  
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  useEffect(() => {
    if (initialPrompt) setGenPrompt(initialPrompt);
  }, [initialPrompt]);

  useEffect(() => {
    if (initialResult) setResult({ loading: false, imageUrl: initialResult });
  }, [initialResult]);

  const moodOptions = useMemo(() => Object.entries(MOOD_MAP).map(([value, key]) => ({ label: t(key), value })), [t]);
  const lightingOptions = useMemo(() => Object.entries(LIGHTING_MAP).map(([value, key]) => ({ label: t(key), value })), [t]);
  
  const sizeOptions = useMemo(() => [
    { label: t('cat.social'), options: [
        { label: `Square (1080x1080)`, value: '1080x1080' },
        { label: `Portrait (1080x1350)`, value: '1080x1350' },
        { label: `Story (1080x1920)`, value: '1080x1920' },
        { label: `Landscape (1280x720)`, value: '1280x720' },
    ]},
    { label: t('cat.standard'), options: [
        { label: '1:1', value: '1:1' },
        { label: '4:3', value: '4:3' },
        { label: '16:9', value: '16:9' },
    ]}
  ], [t]);

  const tabs = useMemo(() => [
    { id: GenerationMode.Generate, icon: 'auto_awesome', label: t('tab.generate') },
    { id: GenerationMode.Collage, icon: 'collections', label: t('tab.collage') },
    { id: GenerationMode.SimplePost, icon: 'amp_stories', label: t('tab.simple_post') },
    { id: GenerationMode.Edit, icon: 'edit', label: t('tab.edit') },
    { id: GenerationMode.Analyze, icon: 'document_scanner', label: t('tab.analyze') }
  ], [t]);

  const activeTabLabel = useMemo(() => {
    return tabs.find(tab => tab.id === activeTab)?.label || '';
  }, [activeTab, tabs]);

  const handleMainStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMainStyle = e.target.value;
    setGenMainStyle(newMainStyle);
    setGenSubStyle(STYLE_HIERARCHY[newMainStyle]?.[0] || 'None');
  };

  const handleAction = async () => {
    setResult({ loading: true, error: undefined });
    try {
      if (activeTab === GenerationMode.Generate) {
        if (!genPrompt) throw new Error("Please enter a prompt.");
        const finalStyle = genMainStyle !== 'None' ? `${genMainStyle} - ${genSubStyle}` : 'None';
        const imageUrl = await generateImage({
          prompt: genPrompt, style: finalStyle, mood: genMood, lighting: genLighting, size: genSize, camera: genCamera, colorGrade: genColor, negativePrompt: genNegativePrompt, seed: genSeed ? parseInt(genSeed) : undefined, referenceImages
        });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: genPrompt, result: imageUrl });
      } else if (activeTab === GenerationMode.Collage) {
        if (collageImages.length < 2) throw new Error("Min 2 images required.");
        const imageUrl = await generateCollage({ prompt: collagePrompt, images: collageImages, layout: collageLayout, theme: collageTheme, size: genSize });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: `Collage: ${collageLayout}`, result: imageUrl });
      } else if (activeTab === GenerationMode.SimplePost) {
        const imageUrl = await generateSimpleSocialPost({ logo: simpleLogo, headline: simpleHeadline, tagline: simpleTagline, content: simpleContent, ctas: simpleCtas, size: genSize });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: `Post: ${simpleHeadline}`, result: imageUrl });
      } else if (activeTab === GenerationMode.Edit) {
        const imageUrl = await editImage({ prompt: editPrompt, sourceImage, mood: editMood, size: editSize });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: `Edit: ${editPrompt}`, result: imageUrl });
      } else if (activeTab === GenerationMode.Analyze) {
        const text = await analyzeImage({ prompt: analyzePrompt, sourceImage, language });
        setResult({ loading: false, text });
        addToHistory({ type: 'analysis', prompt: 'Image Analysis', result: text });
      }
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  return (
    <div className="min-h-screen pb-12 font-sans selection:bg-violet-500/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AppHeader onBack={onBack} title={t('home.graphic.title')} subtitle={t('graphic.subtitle')} />

        <div className="flex justify-center mb-10">
          <div className="w-full max-w-2xl bg-slate-900/40 p-2 rounded-[2rem] border border-slate-800/40 shadow-2xl backdrop-blur-md">
            <div className="flex flex-wrap sm:flex-nowrap gap-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setResult({ loading: false }); }}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-900/20' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="material-icons-round text-lg">{tab.icon}</span>
                  <span className="hidden xs:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4 text-slate-200">
                  <div className="w-10 h-10 rounded-2xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
                    <span className="material-icons-round text-violet-400">tune</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500">{t('section.config')}</h2>
                    <span className="text-xs font-bold text-violet-400 uppercase tracking-widest">{activeTabLabel}</span>
                  </div>
               </div>
            </div>

            {activeTab === GenerationMode.Generate && (
              <div className="space-y-8">
                <TextArea label={t('label.prompt')} placeholder="Describe your vision..." rows={4} value={genPrompt} onChange={(e) => setGenPrompt(e.target.value)} />
                <MultiFileUpload images={referenceImages} onImagesChange={setReferenceImages} maxImages={3} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select label={t('label.style')} icon="palette" options={Object.keys(STYLE_HIERARCHY).map(k => ({ label: k, value: k }))} value={genMainStyle} onChange={handleMainStyleChange} />
                  <Select label={t('label.size')} icon="aspect_ratio" groupedOptions={sizeOptions} value={genSize} onChange={(e) => setGenSize(e.target.value)} />
                </div>
                <div className="pt-4">
                  <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                    <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.generate')}</span>
                  </Button>
                </div>
              </div>
            )}

            {activeTab === GenerationMode.Edit && (
              <div className="space-y-8">
                <FileUpload currentImage={sourceImage} onFileSelect={setSourceImage} />
                <TextArea label={t('label.edit_instructions')} rows={3} value={editPrompt} onChange={(e) => setEditPrompt(e.target.value)} />
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                  <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.apply_edit')}</span>
                </Button>
              </div>
            )}

            {activeTab === GenerationMode.Analyze && (
               <div className="space-y-8">
                 <FileUpload currentImage={sourceImage} onFileSelect={setSourceImage} />
                 <TextArea label={t('label.question')} rows={2} value={analyzePrompt} onChange={(e) => setAnalyzePrompt(e.target.value)} />
                 <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                    <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.analyze')}</span>
                 </Button>
               </div>
            )}
            
            {activeTab === GenerationMode.Collage && (
              <div className="space-y-8">
                <MultiFileUpload images={collageImages} onImagesChange={setCollageImages} maxImages={6} />
                <TextArea label={t('label.prompt')} rows={2} value={collagePrompt} onChange={(e) => setCollagePrompt(e.target.value)} />
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                  <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.generate')}</span>
                </Button>
              </div>
            )}

            {activeTab === GenerationMode.SimplePost && (
              <div className="space-y-8">
                <Input label={t('label.headline')} value={simpleHeadline} onChange={(e) => setSimpleHeadline(e.target.value)} />
                <TextArea label={t('label.content')} value={simpleContent} onChange={(e) => setSimpleContent(e.target.value)} />
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                  <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.generate')}</span>
                </Button>
              </div>
            )}
          </div>

          <div className="h-full min-h-[600px]">
            <GeneratedResultView result={result} title={activeTab === GenerationMode.Analyze ? t('result.title.analyze') : t('result.title.generate')} />
          </div>
        </div>
      </div>
    </div>
  );
};