
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from './Button';
import { TextArea, Select, FileUpload, MultiFileUpload, Input } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GenerationMode, GeneratedResult, SimplePostCTA } from '../types';
import { generateImage, editImage, analyzeImage, generateSimpleSocialPost, describeImageForPrompt } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { STYLE_HIERARCHY, COLOR_GRADE_OPTIONS, LIGHTING_OPTIONS, SIMPLE_POST_THEMES, CAMERA_OPTIONS, LENS_OPTIONS, FOCUS_OPTIONS } from '../constants';

interface GraphicAIProps {
  initialPrompt?: string;
  initialResult?: string;
}

const STORAGE_KEY = 'lumina_graphic_state';

export const GraphicAI: React.FC<GraphicAIProps> = ({ initialPrompt, initialResult }) => {
  const { t, language } = useLanguage();
  const { addToHistory } = useHistory();
  const [activeTab, setActiveTab] = useState<GenerationMode>(GenerationMode.Generate);
  
  const [genPrompt, setGenPrompt] = useState('');
  const [genMainStyle, setGenMainStyle] = useState('None');
  const [genSubStyle, setGenSubStyle] = useState('None');
  const [genMood, setGenMood] = useState('None');
  const [genLighting, setGenLighting] = useState('Natural');
  const [genCamera, setGenCamera] = useState('None');
  const [genLens, setGenLens] = useState('None');
  const [genFocus, setGenFocus] = useState('None');
  const [genColor, setGenColor] = useState('None');
  const [genNegativePrompt, setGenNegativePrompt] = useState('');
  const [genSeed, setGenSeed] = useState<string>(''); 
  const [genSize, setGenSize] = useState<string>('16:9');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const [simpleLogo, setSimpleLogo] = useState<string | null>(null);
  const [simpleBgImage, setSimpleBgImage] = useState<string | null>(null);
  const [simpleHeadline, setSimpleHeadline] = useState('');
  const [simpleTagline, setSimpleTagline] = useState('');
  const [simpleContent, setSimpleContent] = useState('');
  const [simpleAddress, setSimpleAddress] = useState('');
  const [simplePostTheme, setSimplePostTheme] = useState('Clean Minimalist');
  const [simpleCtas, setSimpleCtas] = useState<SimplePostCTA[]>([{ type: 'phone', value: '' }]);

  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editMood, setEditMood] = useState('None');
  const [editSize, setEditSize] = useState('original'); 
  const [analyzePrompt, setAnalyzePrompt] = useState('');
  
  const [result, setResult] = useState<GeneratedResult>({ loading: false });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        setGenPrompt(state.genPrompt || '');
        setGenMainStyle(state.genMainStyle || 'None');
        setGenSubStyle(state.genSubStyle || 'None');
        setGenMood(state.genMood || 'None');
        setGenLighting(state.genLighting || 'Natural');
        setGenCamera(state.genCamera || 'None');
        setGenLens(state.genLens || 'None');
        setGenFocus(state.genFocus || 'None');
        setGenColor(state.genColor || 'None');
        setGenNegativePrompt(state.genNegativePrompt || '');
        setGenSeed(state.genSeed || '');
        setGenSize(state.genSize || '16:9');
        setReferenceImages(state.referenceImages || []);
        setSimpleLogo(state.simpleLogo || null);
        setSimpleBgImage(state.simpleBgImage || null);
        setSimpleHeadline(state.simpleHeadline || '');
        setSimpleTagline(state.simpleTagline || '');
        setSimpleContent(state.simpleContent || '');
        setSimpleAddress(state.simpleAddress || '');
        setSimplePostTheme(state.simplePostTheme || 'Clean Minimalist');
        setSimpleCtas(state.simpleCtas || [{ type: 'phone', value: '' }]);
        setSourceImage(state.sourceImage || null);
        setEditPrompt(state.editPrompt || '');
        setEditMood(state.editMood || 'None');
        setEditSize(state.editSize || 'original');
        setAnalyzePrompt(state.analyzePrompt || '');
        setActiveTab(state.activeTab || GenerationMode.Generate);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const state = {
      genPrompt, genMainStyle, genSubStyle, genMood, genLighting, genCamera, genLens, genFocus, genColor,
      genNegativePrompt, genSeed, genSize, referenceImages, simpleLogo, simpleBgImage, simpleHeadline, simpleTagline,
      simpleContent, simpleAddress, simplePostTheme, simpleCtas, sourceImage, editPrompt, editMood, editSize,
      analyzePrompt, activeTab
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    genPrompt, genMainStyle, genSubStyle, genMood, genLighting, genCamera, genLens, genFocus, genColor,
    genNegativePrompt, genSeed, genSize, referenceImages, simpleLogo, simpleBgImage, simpleHeadline, simpleTagline,
    simpleContent, simpleAddress, simplePostTheme, simpleCtas, sourceImage, editPrompt, editMood, editSize,
    analyzePrompt, activeTab
  ]);

  useEffect(() => { if (initialPrompt) setGenPrompt(initialPrompt); }, [initialPrompt]);
  useEffect(() => { if (initialResult) setResult({ loading: false, imageUrl: initialResult }); }, [initialResult]);

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
    { id: GenerationMode.Generate, label: t('tab.generate'), icon: 'auto_fix_high' },
    { id: GenerationMode.SimplePost, label: t('tab.simple_post'), icon: 'dashboard' },
    { id: GenerationMode.Edit, label: t('tab.edit'), icon: 'brush' },
    { id: GenerationMode.Analyze, label: t('tab.analyze'), icon: 'analytics' }
  ], [t]);

  const handleMainStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setGenMainStyle(newStyle);
    setGenSubStyle(STYLE_HIERARCHY[newStyle]?.[0] || 'None');
  };

  const handleImageToPrompt = async (img: string) => {
    setResult({ loading: true });
    try {
      const desc = await describeImageForPrompt(img);
      setGenPrompt(desc);
      setResult({ loading: false });
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  const handleAction = async () => {
    setResult({ loading: true, error: undefined });
    try {
      if (activeTab === GenerationMode.Generate) {
        const imageUrl = await generateImage({
          prompt: genPrompt, style: `${genMainStyle} - ${genSubStyle}`, mood: genMood, lighting: genLighting, size: genSize, camera: genCamera, lens: genLens, focus: genFocus, colorGrade: genColor, negativePrompt: genNegativePrompt, seed: genSeed ? parseInt(genSeed) : undefined, referenceImages
        });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: genPrompt, result: imageUrl });
      } else if (activeTab === GenerationMode.SimplePost) {
        const imageUrl = await generateSimpleSocialPost({ 
          logo: simpleLogo, backgroundImage: simpleBgImage, headline: simpleHeadline, tagline: simpleTagline, content: simpleContent, address: simpleAddress, ctas: simpleCtas, size: genSize, theme: simplePostTheme
        });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: `Post: ${simpleHeadline || simpleAddress}`, result: imageUrl });
      } else if (activeTab === GenerationMode.Edit) {
        const imageUrl = await editImage({ prompt: editPrompt, sourceImage, mood: editMood, size: editSize });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: editPrompt, result: imageUrl });
      } else if (activeTab === GenerationMode.Analyze) {
        const text = await analyzeImage({ prompt: analyzePrompt, sourceImage, language });
        setResult({ loading: false, text });
        addToHistory({ type: 'analysis', prompt: 'Analysis', result: text });
      }
    } catch (err: any) {
      setResult({ loading: false, error: err.message });
    }
  };

  return (
    <div className="flex-grow p-4 md:p-8">
      {/* Horizontal Dashboard Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-1.5 rounded-2xl w-fit backdrop-blur-md transition-colors">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id)} 
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-indigo-600 dark:bg-violet-600 text-white shadow-lg' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span className="material-icons-round text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Controls Container */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 md:p-8 shadow-sm transition-colors">
          {activeTab === GenerationMode.Generate && (
            <div className="space-y-8">
              <div className="relative group">
                <TextArea 
                  label={t('label.prompt')} 
                  value={genPrompt} 
                  onChange={e => setGenPrompt(e.target.value)} 
                  rows={5} 
                  placeholder="Describe the image you envision in detail..." 
                  className="!p-6 text-base"
                />
                <div className="absolute top-0 right-0 mt-1 mr-1">
                  <button 
                    className="p-2 text-slate-300 hover:text-indigo-500 dark:hover:text-violet-400 transition-colors"
                    title="Clear prompt"
                    onClick={() => setGenPrompt('')}
                  >
                    <span className="material-icons-round text-sm">backspace</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl p-6 border border-slate-100 dark:border-slate-800/50">
                <MultiFileUpload images={referenceImages} onImagesChange={setReferenceImages} maxImages={3} />
                
                {referenceImages.length > 0 && (
                  <button 
                    onClick={() => handleImageToPrompt(referenceImages[0])}
                    className="w-full mt-4 py-3.5 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-500 dark:hover:border-violet-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-icons-round text-base">psychology</span>
                    {t('btn.image_to_prompt')}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                <Select label={t('label.style')} options={Object.keys(STYLE_HIERARCHY).map(s => ({ label: s, value: s }))} value={genMainStyle} onChange={handleMainStyleChange} icon="palette" />
                <Select label={t('label.size')} groupedOptions={sizeOptions} value={genSize} onChange={e => setGenSize(e.target.value)} icon="aspect_ratio" />
                <Select label={t('label.color')} options={COLOR_GRADE_OPTIONS} value={genColor} onChange={e => setGenColor(e.target.value)} icon="color_lens" />
                <Select label={t('label.lighting')} options={LIGHTING_OPTIONS} value={genLighting} onChange={e => setGenLighting(e.target.value)} icon="wb_sunny" />
                <Select label={t('label.camera')} options={CAMERA_OPTIONS} value={genCamera} onChange={e => setGenCamera(e.target.value)} icon="videocam" />
                <Select label="Focus" options={FOCUS_OPTIONS} value={genFocus} onChange={e => setGenFocus(e.target.value)} icon="center_focus_strong" />
              </div>
              
              <div className="pt-6">
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5 shadow-2xl shadow-indigo-500/20 dark:shadow-violet-900/30 !rounded-3xl">
                  <div className="flex items-center justify-center gap-3">
                    <span className="material-icons-round text-xl">auto_awesome</span>
                    <span className="font-black uppercase tracking-[0.25em] text-sm">{t('btn.generate')}</span>
                  </div>
                </Button>
              </div>
            </div>
          )}
          
          {activeTab === GenerationMode.SimplePost && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload label={t('label.logo')} currentImage={simpleLogo} onFileSelect={setSimpleLogo} onFileRemove={() => setSimpleLogo(null)} />
                <FileUpload label={t('label.bg_image')} currentImage={simpleBgImage} onFileSelect={setSimpleBgImage} onFileRemove={() => setSimpleBgImage(null)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('label.headline')} value={simpleHeadline} onChange={e => setSimpleHeadline(e.target.value)} placeholder="Main Title" />
                <Input label={t('label.tagline')} value={simpleTagline} onChange={e => setSimpleTagline(e.target.value)} placeholder="Slogan" />
              </div>
              <TextArea label={t('label.content')} value={simpleContent} onChange={e => setSimpleContent(e.target.value)} rows={2} placeholder="Post description..." />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('label.address')} value={simpleAddress} onChange={e => setSimpleAddress(e.target.value)} placeholder="Location" />
                <Select label={t('label.theme')} options={SIMPLE_POST_THEMES} value={simplePostTheme} onChange={e => setSimplePostTheme(e.target.value)} icon="style" />
              </div>
              <Button onClick={handleAction} loading={result.loading} className="w-full !py-4">
                <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.generate')}</span>
              </Button>
            </div>
          )}
          
          {activeTab === GenerationMode.Edit && (
            <div className="space-y-6">
              <FileUpload currentImage={sourceImage} onFileSelect={setSourceImage} onFileRemove={() => setSourceImage(null)} />
              <TextArea label={t('label.edit_instructions')} value={editPrompt} onChange={e => setEditPrompt(e.target.value)} rows={3} placeholder="Describe modifications..." />
              <Button onClick={handleAction} loading={result.loading} className="w-full !py-4">
                 <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.apply_edit')}</span>
              </Button>
            </div>
          )}
          
          {activeTab === GenerationMode.Analyze && (
            <div className="space-y-6">
              <FileUpload currentImage={sourceImage} onFileSelect={setSourceImage} onFileRemove={() => setSourceImage(null)} />
              <TextArea label={t('label.question')} value={analyzePrompt} onChange={e => setAnalyzePrompt(e.target.value)} placeholder="Ask about the image..." />
              <Button onClick={handleAction} loading={result.loading} className="w-full !py-4">
                <span className="font-black uppercase tracking-[0.2em] text-xs">{t('btn.analyze')}</span>
              </Button>
            </div>
          )}
        </div>
        
        {/* Result View Container */}
        <div className="h-full">
          <GeneratedResultView result={result} title={t(`result.title.${activeTab === GenerationMode.Analyze ? 'analyze' : 'generate'}`)} onClear={() => setResult({ loading: false })} />
        </div>
      </div>
    </div>
  );
};
