import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'mm';

const translations: Record<Language, Record<string, string>> = {
  en: {
    // App General
    'app.title': 'Lumina AI Studio',
    'app.subtitle': 'Professional AI Studio',
    'btn.history': 'History',
    'history.title': 'Recent Creations',
    'history.empty': 'No history yet.',
    'history.clear': 'Clear History',
    
    // Home
    'home.graphic.title': 'Graphic AI',
    'home.graphic.desc': 'Professional Image Generation, Editing & Analysis Studio.',
    'home.content.title': 'Content AI',
    'home.content.desc': 'Smart Copywriting, Summarization, and Text Generation.',
    'home.prompt.title': 'Prompt Engineer',
    'home.prompt.desc': 'Persona-driven assistant for brainstorming and direct tasks.',

    // Titles & Subtitles
    'graphic.subtitle': 'Graphic AI Workspace',
    'content.title': 'Content AI',
    'content.subtitle': 'Content AI Workspace',
    'prompt.title': 'Prompt Engineer',
    'prompt.subtitle': 'Prompt Engineer Workspace',

    // Tabs
    'tab.generate': 'Generate',
    'tab.edit': 'Edit',
    'tab.analyze': 'Analyze',
    'tab.simple_post': 'Simple Post',
    'tab.collage': 'Collage',

    // Labels - Graphic AI
    'label.prompt': 'Description / Prompt',
    'label.style': 'Artistic Style',
    'label.substyle': 'Technique / Sub-Style',
    'label.mood': 'Atmosphere / Mood',
    'label.lighting': 'Lighting',
    'label.camera': 'Perspective / Camera',
    'label.color': 'Color Grade',
    'label.negative': 'Negative Prompt (Exclude)',
    'label.seed': 'Seed (Optional)',
    'label.size': 'Image Format',
    'label.edit_instructions': 'Modification Details',
    'label.target_mood': 'New Atmosphere',
    'label.output_format': 'Format',
    'label.question': 'Analysis Focus',
    'label.collage_images': 'Collage Images (Max 6)',
    'label.layout': 'Layout Style',
    'label.theme': 'Background Theme',
    
    // Labels - Simple Social Post
    'label.logo': 'Brand Logo',
    'label.headline': 'Main Headline',
    'label.tagline': 'Tagline / Slogan',
    'label.content': 'Main Body Content',
    'label.cta': 'Call to Action / Contact Info',
    'label.cta_type': 'Type',
    'label.cta_value': 'Contact Info',

    // Labels - Content AI
    'label.pageName': 'Page Name',
    'label.creatorPersona': 'Author Persona',
    'label.topic': 'Topic / Title',
    'label.platform': 'Platform',
    'label.targetAudience': 'Target Audience',
    'label.tone': 'Tone of Voice',
    'label.length': 'Text Length',
    'label.useEmojis': 'Include Emojis',
    'label.referenceUrls': 'Reference URLs',
    'label.referenceImages': 'Reference Images',
    'label.context': 'Additional Context',

    // Labels - Prompt Engineer
    'label.template': 'Assistant Template',
    'label.systemInstruction': 'System Instruction',
    'label.draft': 'Input / Draft',
    'label.complexity': 'Complexity Level',
    'tag.persona': 'PERSONA & RULES',

    // Buttons
    'btn.enhance': 'Generate Output',
    'btn.generate': 'Generate Now',
    'btn.randomize': 'Try Random',
    'btn.apply_edit': 'Process Edit',
    'btn.analyze': 'Run Analysis',
    'btn.write': 'Generate Content',
    'btn.addUrl': 'Add',
    'btn.copy': 'Copy',
    'btn.download': 'Save',
    'btn.edit_text': 'Edit',
    'btn.save_edit': 'Save Changes',
    'btn.gen_titles': 'Ideas',
    'btn.gen_image': 'Visual Prompt',
    'btn.use_graphic': 'Use in Graphic AI',
    'btn.use_content': 'Use in Content AI',
    'btn.add_cta': 'Add Contact',

    // Results & Status
    'result.title.prompt': 'Result',
    'result.title.generate': 'Visual Result',
    'result.title.analyze': 'Art Director Report',
    'result.title.content': 'Generated Content',
    'result.processing': 'Lumina is processing...',
    'result.ready': 'Awaiting input...',

    // Options - Complexity & Templates
    'opt.template.load': 'Choose a persona...',
    'opt.comp.concise': 'Concise',
    'opt.comp.detailed': 'Detailed',
    'opt.comp.cot': 'Chain of Thought',
    'temp.code': 'Code Refactoring Expert',
    'temp.linguist': 'Professional Linguist',
    'temp.writer': 'Creative Storyteller',
    'temp.data': 'Data Analyst',
    'temp.marketing': 'Marketing Copywriter',
    'temp.midjourney': 'Midjourney Photographer',
    'temp.promptWriter': 'Expert Prompt Writer',

    // Options - Personas
    'persona.general': 'General Assistant',
    'persona.tech': 'Tech Expert',
    'persona.fitness': 'Fitness Guru',
    'persona.business': 'Business Consultant',
    'persona.creative': 'Creative Writer',
    'persona.marketer': 'Digital Marketer',
    'persona.influencer': 'Influencer',
    'persona.academic': 'Academic Researcher',

    // Options - Platforms
    'plat.facebook': 'Facebook',
    'plat.instagram': 'Instagram',
    'plat.twitter': 'X (Twitter)',
    'plat.linkedin': 'LinkedIn',
    'plat.blog': 'Blog Post',
    'plat.email': 'Email',
    'plat.youtube': 'YouTube',
    'plat.tiktok': 'TikTok',

    // Options - Tones
    'tone.pro': 'Professional',
    'tone.casual': 'Casual',
    'tone.witty': 'Witty',
    'tone.urgent': 'Urgent',
    'tone.empathetic': 'Empathetic',
    'tone.educational': 'Educational',
    'tone.inspiring': 'Inspiring',

    // Options - Lengths
    'len.short': 'Short',
    'len.medium': 'Medium',
    'len.long': 'Long',

    // Options - Graphic Controls
    'opt.none': 'None',
    'opt.yes': 'Yes',
    'opt.no': 'No',
    'opt.original': 'Original Dimensions',
    'cat.social': 'Social Optimized',
    'cat.standard': 'Standard Ratios',

    // Moods, Lighting, Camera, Color Grade
    'mood.calm': 'Calm',
    'mood.energetic': 'Energetic',
    'mood.dark': 'Dark',
    'mood.playful': 'Playful',
    'mood.elegant': 'Elegant',
    'mood.cozy': 'Cozy',
    'mood.professional': 'Professional',
    'mood.ethereal': 'Ethereal',
    'mood.melancholic': 'Melancholy',
    'mood.romantic': 'Romantic',

    'light.natural': 'Natural',
    'light.studio': 'Studio Soft Light',
    'light.cinematic': 'Cinematic Soft Light',
    'light.rembrandt': 'Strong Contrast',
    'light.golden': 'Warm Golden Light',
    'light.neon': 'Glow / Neon Accent',
    'light.ambient': 'Ambient Lighting',
    'light.lowkey': 'Low Key Lighting',
    'light.flat': 'Flat Lighting',

    'cam.none': 'Default View',
    'cam.closeup': 'Close-up',
    'cam.wide': 'Wide Angle',
    'cam.drone': 'Aerial View',
    'cam.eye': 'Eye Level',
    'cam.lowangle': 'Low Angle',
    'cam.highangle': 'High Angle',
    'cam.isometric': 'Isometric',

    'col.none': 'Default Colors',
    'col.vibrant': 'Vibrant Colors',
    'col.bw': 'Black and White',
    'col.pastel': 'Pastel Palette',
    'col.cinematic': 'Teal & Orange',
    'col.vintage': 'Vintage / Retro',
    'col.muted': 'Muted Tones',

    // Collage Layouts
    'lay.grid': 'Balanced Grid',
    'lay.mosaic': 'Artistic Mosaic',
    'lay.overlap': 'Creative Overlap',
    'lay.circular': 'Circular / Radial',
    'lay.freestyle': 'Freestyle Scrapbook',

    // Collage Themes
    'theme.minimal': 'Clean Minimalist',
    'theme.dark': 'Modern Dark',
    'theme.paper': 'Vintage Paper',
    'theme.nature': 'Natural / Organic',
    'theme.neon': 'Futuristic Neon',

    // CTA Options
    'opt.phone': 'Phone Number',
    'opt.email': 'Email Address',

    // Upload & MultiUpload
    'upload.label': 'SOURCE IMAGE',
    'upload.click_drop': 'Upload Image',
    'upload.replace': 'Replace',
    'upload.ref_label': 'REFERENCE IMAGES',
    'upload.add': 'ADD',
    'section.config': 'CONFIGURATION',
  },
  mm: {
    // App General
    'app.title': 'Lumina AI Studio',
    'app.subtitle': 'ပရော်ဖက်ရှင်နယ် AI စတူဒီယို',
    'btn.history': 'မှတ်တမ်း',
    'history.title': 'လတ်တလော ဖန်တီးမှုများ',
    'history.empty': 'မှတ်တမ်း မရှိသေးပါ။',
    'history.clear': 'မှတ်တမ်း ရှင်းမည်',

    // Home
    'home.graphic.title': 'Graphic AI (ဂရပ်ဖစ်)',
    'home.graphic.desc': 'ပရော်ဖက်ရှင်နယ် ပုံဖန်တီးခြင်း၊ ပြင်ဆင်ခြင်း နှင့် သုံးသပ်ခြင်း။',
    'home.content.title': 'Content AI (စာပေ)',
    'home.content.desc': 'ဆောင်းပါး၊ စာတို နှင့် စာပေအမျိုးမျိုး ဖန်တီးရန်။',
    'home.prompt.title': 'Prompt Engineer (အမိန့်ပေးစာ)',
    'home.prompt.desc': 'သာမန် စိတ်ကူးများကို အဆင့်မြင့် Prompt များအဖြစ် ပြောင်းလဲပါ။',

    // Titles & Subtitles
    'graphic.subtitle': 'Graphic AI စတူဒီယို',
    'content.title': 'စာပေ ဖန်တီးသူ',
    'content.subtitle': 'Content AI စတူဒီယို',
    'prompt.title': 'Prompt အင်ဂျင်နီယာ',
    'prompt.subtitle': 'Prompt Engineer စတူဒီယို',

    // Tabs
    'tab.generate': 'ပုံထုတ်လုပ်မည်',
    'tab.edit': 'ပုံပြင်ဆင်မည်',
    'tab.analyze': 'သုံးသပ်မည်',
    'tab.simple_post': 'ကြော်ငြာပုံစံ',
    'tab.collage': 'ပုံများ စုစည်းမည်',

    // Labels
    'label.prompt': 'ပုံဖော်ရန် ဖော်ပြချက်',
    'label.style': 'အနုပညာ ပုံစံ',
    'label.substyle': 'နည်းပညာ / ပုံစံခွဲ',
    'label.mood': 'ခံစားချက် / လေထု',
    'label.lighting': 'အလင်းအမှောင်',
    'label.camera': 'ရိုက်ကူးသည့် ထောင့်',
    'label.color': 'အရောင် အထားအသို',
    'label.negative': 'မလိုလားအပ်သော အချက်များ',
    'label.seed': 'နံပါတ် (Seed)',
    'label.size': 'ပုံ အရွယ်အစား',
    'label.edit_instructions': 'ပြင်ဆင်ရန် အချက်များ',
    'label.target_mood': 'အသစ်ပြောင်းလဲလိုသည့် လေထု',
    'label.output_format': 'ပုံစံ',
    'label.question': 'သုံးသပ်လိုသည့် အချက်',
    'label.logo': 'အမှတ်တံဆိပ် (Logo)',
    'label.headline': 'ခေါင်းစဉ်ကြီး',
    'label.tagline': 'ဆောင်ပုဒ်',
    'label.content': 'စာသား အချက်အလက်',
    'label.cta': 'ဆက်သွယ်ရန်',
    'label.cta_type': 'အမျိုးအစား',
    'label.cta_value': 'ဆက်သွယ်ရန် အချက်အလက်',
    'label.template': 'အကူအညီပေးသူ ပုံစံ',
    'label.systemInstruction': 'စနစ် ညွှန်ကြားချက်',
    'label.draft': 'မူကြမ်း / စိတ်ကူး',
    'label.complexity': 'အသေးစိတ်မှု အဆင့်',
    'label.context': 'အပိုဆောင်း အချက်အလက်',
    'label.pageName': 'စာမျက်နှာ အမည်',
    'label.creatorPersona': 'ဖန်တီးသူ ပုံစံ',
    'label.topic': 'ခေါင်းစဉ် / အကြောင်းအရာ',
    'label.platform': 'ပလက်ဖောင်း',
    'label.targetAudience': 'ပစ်မှတ် ပရိသတ်',
    'label.tone': 'လေသံ / ခံစားချက်',
    'label.length': 'စာသား အရှည်',
    'label.useEmojis': 'အီမိုဂျီ သုံးမလား',
    'label.referenceUrls': 'ကိုးကားရန် လင့်ခ်များ',
    'label.referenceImages': 'ကိုးကားရန် ပုံများ',
    'label.collage_images': 'စုစည်းလိုသော ပုံများ (အများဆုံး ၆ ပုံ)',
    'label.layout': 'စီမံမှု ပုံစံ',
    'label.theme': 'နောက်ခံ အခင်းအကျင်း',
    'tag.persona': 'ကိုယ်ပွား နှင့် စည်းမျဉ်းများ',
    'section.config': 'ပြင်ဆင်ချက်များ',

    // Buttons
    'btn.enhance': 'လုပ်ဆောင်ချက် စတင်မည်',
    'btn.generate': 'ပုံထုတ်လုပ်မည်',
    'btn.randomize': 'နမူနာ စမ်းကြည့်မည်',
    'btn.apply_edit': 'ပြင်ဆင်ချက် သုံးမည်',
    'btn.analyze': 'သုံးသပ်မည်',
    'btn.write': 'စာရေးသားမည်',
    'btn.addUrl': 'ထည့်မည်',
    'btn.copy': 'ကူးယူမည်',
    'btn.download': 'သိမ်းဆည်းမည်',
    'btn.edit_text': 'ပြင်ဆင်မည်',
    'btn.save_edit': 'သိမ်းဆည်းမည်',
    'btn.gen_titles': 'ခေါင်းစဉ် စိတ်ကူးများ',
    'btn.gen_image': 'ပုံဖော်ရန် အမိန့်',
    'btn.use_graphic': 'ဂရပ်ဖစ် အိုင်အေ တွင်သုံးမည်',
    'btn.use_content': 'စာပေ အိုင်အေ တွင်သုံးမည်',
    'btn.add_cta': 'ဆက်သွယ်ရန် ထည့်မည်',

    // Results & Status
    'result.title.prompt': 'ရလဒ်',
    'result.title.generate': 'ထုတ်လုပ်ထားသော ပုံ',
    'result.title.analyze': 'သုံးသပ်ချက် အစီရင်ခံစာ',
    'result.title.content': 'ရေးသားထားသော စာပေ',
    'result.processing': 'Lumina မှ လုပ်ဆောင်နေပါသည်...',
    'result.ready': 'အချက်အလက်များကို စောင့်ဆိုင်းနေပါသည်...',

    // Options - Complexity & Templates
    'opt.template.load': 'ပုံစံတစ်ခု ရွေးချယ်ပါ...',
    'opt.comp.concise': 'တိုတိုနှင့် လိုရင်း',
    'opt.comp.detailed': 'အသေးစိတ်',
    'opt.comp.cot': 'စဉ်းစားတွေးခေါ်မှု အဆင့်ဆင့်',
    'temp.code': 'ကုဒ် ပြင်ဆင်ရေး ကျွမ်းကျင်သူ',
    'temp.linguist': 'ဘာသာဗေဒ ပညာရှင်',
    'temp.writer': 'စာရေးဆရာ',
    'temp.data': 'ဒေတာ သုံးသပ်သူ',
    'temp.marketing': 'စျေးကွက် စာရေးဆရာ',
    'temp.midjourney': 'ဓာတ်ပုံ ပညာရှင်',
    'temp.promptWriter': 'အမိန့်ပေးစာ ကျွမ်းကျင်သူ',

    // Options - Personas
    'persona.general': 'အထွေထွေ အကူအညီပေးသူ',
    'persona.tech': 'နည်းပညာ ကျွမ်းကျင်သူ',
    'persona.fitness': 'ကျန်းမာရေး လမ်းညွှန်',
    'persona.business': 'စီးပွားရေး အကြံပေး',
    'persona.creative': 'ဖန်တီးမှု စာရေးဆရာ',
    'persona.marketer': 'စျေးကွက် ရှာဖွေရေး ကျွမ်းကျင်သူ',
    'persona.influencer': 'အင်ဖလော်ရန်စာ',
    'persona.academic': 'ပညာရပ်ဆိုင်ရာ သုတေသနပညာရှင်',

    // Options - Platforms
    'plat.facebook': 'Facebook',
    'plat.instagram': 'Instagram',
    'plat.twitter': 'X (Twitter)',
    'plat.linkedin': 'LinkedIn',
    'plat.blog': 'ဘလော့ဂ် ဆောင်းပါး',
    'plat.email': 'အီးမေးလ်',
    'plat.youtube': 'YouTube',
    'plat.tiktok': 'TikTok',

    // Options - Tones
    'tone.pro': 'ပရော်ဖက်ရှင်နယ်',
    'tone.casual': 'သာမန် လွတ်လပ်သော',
    'tone.witty': 'ဟာသနှောသော',
    'tone.urgent': 'အရေးကြီးသော',
    'tone.empathetic': 'စာနာမှုရှိသော',
    'tone.educational': 'ပညာပေးသော',
    'tone.inspiring': 'ခွန်အားဖြစ်စေသော',

    // Options - Lengths
    'len.short': 'တို',
    'len.medium': 'အလယ်အလတ်',
    'len.long': 'ရှည်',

    // Options - Graphic Controls
    'opt.none': 'မရှိ',
    'opt.yes': 'ရှိ',
    'opt.no': 'မရှိ',
    'opt.original': 'မူလ အရွယ်အစား',
    'cat.social': 'ဆိုရှယ်မီဒီယာ အတွက်',
    'cat.standard': 'ပုံမှန် အရွယ်အစားများ',

    // Moods, Lighting, Camera, Color Grade
    'mood.calm': 'အေးချမ်းသော',
    'mood.energetic': 'တက်ကြွသော',
    'mood.dark': 'မှောင်မိုက်သော',
    'mood.playful': 'ပျော်ရွှင်စရာ',
    'mood.elegant': 'ခန့်ညားသော',
    'mood.cozy': 'နွေးထွေးသော',
    'mood.professional': 'ပရော်ဖက်ရှင်နယ်',
    'mood.ethereal': 'နတ်သျှင် ဆန်သော',
    'mood.melancholic': 'အလွမ်းဆန်သော',
    'mood.romantic': 'ရိုမန်းတစ် ဆန်သော',

    'light.natural': 'သဘာဝ အလင်း',
    'light.studio': 'စတူဒီယို အလင်းပျော့',
    'light.cinematic': 'ရုပ်ရှင်ဆန်သော အလင်းပျော့',
    'light.rembrandt': 'ပြင်းထန်သော အလင်းအမှောင်',
    'light.golden': 'ရွှေရောင် အလင်းနွေး',
    'light.neon': 'နီယွန် အလင်းရောင်',
    'light.ambient': 'ပတ်ဝန်းကျင် အလင်း',
    'light.lowkey': 'အလင်းနည်းသော ပုံစံ',
    'light.flat': 'အလင်းညီညာသော ပုံစံ',

    'cam.none': 'ပုံမှန် အမြင်',
    'cam.closeup': 'အနီးကပ်',
    'cam.wide': 'အမြင်ကျယ်',
    'cam.drone': 'အပေါ်စီးမှ အမြင်',
    'cam.eye': 'မျက်စိ တစ်ဆုံး အမြင်',
    'cam.lowangle': 'အောက်မှ အထက်သို့ အမြင်',
    'cam.highangle': 'အထက်မှ အောက်သို့ အမြင်',
    'cam.isometric': 'အိုင်ဆိုမက်ထရစ် အမြင်',

    'col.none': 'မူလ အရောင်',
    'col.vibrant': 'တောက်ပသော အရောင်',
    'col.bw': 'အဖြူအမည်း',
    'col.pastel': 'ပက်စတယ် အရောင်',
    'col.cinematic': 'ရုပ်ရှင်ဆန်သော အရောင်',
    'col.vintage': 'ရှေးဟောင်း ပုံစံ',
    'col.muted': 'အရောင်မှိန်မှိန်',

    'lay.grid': 'ပုံသေ ဇယားကွက်',
    'lay.mosaic': 'အနုပညာ ဆန်သော အစီအရီ',
    'lay.overlap': 'ထပ်နေသော ပုံစံ',
    'lay.circular': 'စက်ဝိုင်း ပုံစံ',
    'lay.freestyle': 'လွတ်လပ်သော ပုံစံ',

    'theme.minimal': 'ရိုးရှင်း သန့်ရှင်းသော',
    'theme.dark': 'ခေတ်မီ အမှောင်',
    'theme.paper': 'ရှေးဟောင်း စက္ကူ',
    'theme.nature': 'သဘာဝ ဆန်သော',
    'theme.neon': 'ခေတ်လွန် နီယွန်',

    'opt.phone': 'ဖုန်းနံပါတ်',
    'opt.email': 'အီးမေးလ်',

    'upload.label': 'မူလပုံ တင်ရန်',
    'upload.click_drop': 'ပုံ တင်ရန် နှိပ်ပါ',
    'upload.replace': 'ပုံ ပြောင်းရန်',
    'upload.ref_label': 'ကိုးကားရန် ပုံများ',
    'upload.add': 'ပေါင်းထည့်မည်',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: string): string => translations[language][key] || translations['en'][key] || key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};