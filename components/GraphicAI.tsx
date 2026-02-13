import React, { useState, useMemo, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { Button } from './Button';
import { TextArea, Select, FileUpload, MultiFileUpload, Input } from './InputControls';
import { GeneratedResultView } from './GeneratedResultView';
import { GenerationMode, GeneratedResult, SimplePostCTA } from '../types';
import { generateImage, editImage, analyzeImage, generateSimpleSocialPost, generateCollage, describeImageForPrompt } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { useHistory } from '../contexts/HistoryContext';
import { STYLE_HIERARCHY, COLOR_GRADE_OPTIONS, LIGHTING_OPTIONS, COLLAGE_LAYOUTS, SIMPLE_POST_THEMES, CAMERA_OPTIONS, LENS_OPTIONS, FOCUS_OPTIONS } from '../constants';

interface GraphicAIProps {
  onBack: () => void;
  initialPrompt?: string;
  initialResult?: string;
}

const STORAGE_KEY = 'lumina_graphic_state';

export const GraphicAI: React.FC<GraphicAIProps> = ({ onBack, initialPrompt, initialResult }) => {
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

  const [collageImages, setCollageImages] = useState<string[]>([]);
  const [collageLayout, setCollageLayout] = useState('Balanced Grid');
  const [collageTheme, setCollageTheme] = useState('Clean Minimalist');
  const [collagePrompt, setCollagePrompt] = useState('');

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
        setCollageImages(state.collageImages || []);
        setCollageLayout(state.collageLayout || 'Balanced Grid');
        setCollageTheme(state.collageTheme || 'Clean Minimalist');
        setCollagePrompt(state.collagePrompt || '');
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
      genNegativePrompt, genSeed, genSize, referenceImages, collageImages, collageLayout,
      collageTheme, collagePrompt, simpleLogo, simpleBgImage, simpleHeadline, simpleTagline,
      simpleContent, simpleAddress, simplePostTheme, simpleCtas, sourceImage, editPrompt, editMood, editSize,
      analyzePrompt, activeTab
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [
    genPrompt, genMainStyle, genSubStyle, genMood, genLighting, genCamera, genLens, genFocus, genColor,
    genNegativePrompt, genSeed, genSize, referenceImages, collageImages, collageLayout,
    collageTheme, collagePrompt, simpleLogo, simpleBgImage, simpleHeadline, simpleTagline,
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
    { id: GenerationMode.Generate, label: t('tab.generate') },
    { id: GenerationMode.Collage, label: t('tab.collage') },
    { id: GenerationMode.SimplePost, label: t('tab.simple_post') },
    { id: GenerationMode.Edit, label: t('tab.edit') },
    { id: GenerationMode.Analyze, label: t('tab.analyze') }
  ], [t]);

  const handleMainStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStyle = e.target.value;
    setGenMainStyle(newStyle);
    setGenSubStyle(STYLE_HIERARCHY[newStyle]?.[0] || 'None');
  };

  const handleError = (err: any) => {
    const msg = err.message || String(err);
    if (msg.includes("Requested entity was not found") || msg.toLowerCase().includes("unauthorized") || msg.includes("401") || msg.includes("API Key is not configured")) {
      window.dispatchEvent(new CustomEvent('reset-api-key'));
    }
    setResult({ loading: false, error: msg });
  };

  const handleImageToPrompt = async (img: string) => {
    setResult({ loading: true });
    try {
      const desc = await describeImageForPrompt(img);
      setGenPrompt(desc);
      setResult({ loading: false });
    } catch (err: any) {
      handleError(err);
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
      } else if (activeTab === GenerationMode.Collage) {
        const imageUrl = await generateCollage({ prompt: collagePrompt, images: collageImages, layout: collageLayout, theme: collageTheme, size: genSize });
        setResult({ loading: false, imageUrl });
        addToHistory({ type: 'image', prompt: `Collage: ${collageLayout}`, result: imageUrl });
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
      handleError(err);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <AppHeader onBack={onBack} title={t('home.graphic.title')} subtitle={t('graphic.subtitle')} />
        
        {/* Navigation Tabs Bar - Fixed design to match "FIX" image */}
        <div className="w-full flex justify-center mb-10">
          <div className="flex bg-[#0f172a] rounded-3xl p-1 border border-slate-800 shadow-2xl w-full max-w-4xl overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`flex-1 min-w-[110px] flex items-center justify-center px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#8b5cf6] text-white shadow-xl ring-1 ring-white/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Controls Container */}
          <div className="bg-slate-900/80 border border-slate-800/60 rounded-[2.5rem] p-6 md:p-10 shadow-2xl backdrop-blur-md">
            {activeTab === GenerationMode.Generate && (
              <div className="space-y-8">
                <TextArea label={t('label.prompt')} value={genPrompt} onChange={e => setGenPrompt(e.target.value)} rows={4} placeholder="Describe the masterpiece you imagine..." />
                
                <div className="flex flex-col gap-3">
                  <MultiFileUpload images={referenceImages} onImagesChange={setReferenceImages} maxImages={3} />
                  {referenceImages.length > 0 && (
                    <Button variant="outline" icon="auto_fix_high" className="text-[10px] py-2 uppercase tracking-widest border-violet-500/20 text-violet-400 hover:bg-violet-500/10" onClick={() => handleImageToPrompt(referenceImages[0])}>
                      {t('btn.image_to_prompt')}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  <Select label={t('label.style')} options={Object.keys(STYLE_HIERARCHY).map(s => ({ label: s, value: s }))} value={genMainStyle} onChange={handleMainStyleChange} icon="palette" />
                  <Select label={t('label.size')} groupedOptions={sizeOptions} value={genSize} onChange={e => setGenSize(e.target.value)} icon="aspect_ratio" />
                  <Select label={t('label.color')} options={COLOR_GRADE_OPTIONS} value={genColor} onChange={e => setGenColor(e.target.value)} icon="color_lens" />
                  <Select label={t('label.lighting')} options={LIGHTING_OPTIONS} value={genLighting} onChange={e => setGenLighting(e.target.value)} icon="wb_sunny" />
                  <Select label={t('label.camera')} options={CAMERA_OPTIONS} value={genCamera} onChange={e => setGenCamera(e.target.value)} icon="videocam" />
                  <Select label="Lens" options={LENS_OPTIONS} value={genLens} onChange={e => setGenLens(e.target.value)} icon="camera" />
                  <Select label="Focus" options={FOCUS_OPTIONS} value={genFocus} onChange={e => setGenFocus(e.target.value)} icon="center_focus_strong" />
                </div>
                
                <div className="pt-4">
                  <Button onClick={handleAction} loading={result.loading} className="w-full !py-5 shadow-2xl shadow-violet-900/20 transform hover:scale-[1.01] active:scale-[0.99]">
                    <span className="font-black uppercase tracking-[0.3em] text-xs">{t('btn.generate')}</span>
                  </Button>
                </div>
              </div>
            )}
            
            {activeTab === GenerationMode.Collage && (
              <div className="space-y-8">
                <MultiFileUpload images={collageImages} onImagesChange={setCollageImages} maxImages={6} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select label={t('label.layout')} options={COLLAGE_LAYOUTS} value={collageLayout} onChange={e => setCollageLayout(e.target.value)} icon="grid_view" />
                  <Select label={t('label.theme')} options={SIMPLE_POST_THEMES} value={collageTheme} onChange={e => setCollageTheme(e.target.value)} icon="auto_fix_normal" />
                </div>
                <TextArea label={t('label.prompt')} value={collagePrompt} onChange={e => setCollagePrompt(e.target.value)} rows={2} placeholder="Optional instructions for image arrangement..." />
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                   <span className="font-black uppercase tracking-[0.3em] text-xs">{t('btn.generate')}</span>
                </Button>
              </div>
            )}
            
            {activeTab === GenerationMode.SimplePost && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload label={t('label.logo')} currentImage={simpleLogo} onFileSelect={setSimpleLogo} onFileRemove={() => setSimpleLogo(null)} />
                  <FileUpload label={t('label.bg_image')} currentImage={simpleBgImage} onFileSelect={setSimpleBgImage} onFileRemove={() => setSimpleBgImage(null)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label={t('label.headline')} value={simpleHeadline} onChange={e => setSimpleHeadline(e.target.value)} placeholder="Main Title" />
                  <Input label={t('label.tagline')} value={simpleTagline} onChange={e => setSimpleTagline(e.target.value)} placeholder="Catchy Slogan" />
                </div>
                <TextArea label={t('label.content')} value={simpleContent} onChange={e => setSimpleContent(e.target.value)} rows={2} placeholder="Detailed description or call to action text..." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label={t('label.address')} value={simpleAddress} onChange={e => setSimpleAddress(e.target.value)} placeholder="Physical location" />
                  <Select label={t('label.theme')} options={SIMPLE_POST_THEMES} value={simplePostTheme} onChange={e => setSimplePostTheme(e.target.value)} icon="style" />
                </div>
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                  <span className="font-black uppercase tracking-[0.3em] text-xs">{t('btn.generate')}</span>
                </Button>
              </div>
            )}
            
            {activeTab === GenerationMode.Edit && (
              <div className="space-y-8">
                <FileUpload currentImage={sourceImage} onFileSelect={setSourceImage} onFileRemove={() => setSourceImage(null)} />
                {sourceImage && (
                  <Button variant="outline" icon="auto_fix_high" className="text-[10px] py-2 uppercase tracking-widest" onClick={() => handleImageToPrompt(sourceImage)}>
                    {t('btn.image_to_prompt')}
                  </Button>
                )}
                <TextArea label={t('label.edit_instructions')} value={editPrompt} onChange={e => setEditPrompt(e.target.value)} rows={3} placeholder="Describe the changes you want (e.g., Change hair color to blue)..." />
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                   <span className="font-black uppercase tracking-[0.3em] text-xs">{t('btn.apply_edit')}</span>
                </Button>
              </div>
            )}
            
            {activeTab === GenerationMode.Analyze && (
              <div className="space-y-8">
                <FileUpload currentImage={sourceImage} onFileSelect={setSourceImage} onFileRemove={() => setSourceImage(null)} />
                <TextArea label={t('label.question')} value={analyzePrompt} onChange={e => setAnalyzePrompt(e.target.value)} placeholder="Ask anything about the image (e.g., What are the main colors?)..." />
                <Button onClick={handleAction} loading={result.loading} className="w-full !py-5">
                  <span className="font-black uppercase tracking-[0.3em] text-xs">{t('btn.analyze')}</span>
                </Button>
              </div>
            )}
          </div>
          
          {/* Result View Container */}
          <div className="h-full min-h-[600px]">
            <GeneratedResultView result={result} title={t(`result.title.${activeTab === GenerationMode.Analyze ? 'analyze' : 'generate'}`)} onClear={() => setResult({ loading: false })} />
          </div>
        </div>
      </div>
    </div>
  );
};
