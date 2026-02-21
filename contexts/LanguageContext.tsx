
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    'home.prompt.title': 'Prompt Lab',
    'home.prompt.desc': 'Persona-driven assistant for brainstorming and direct tasks.',

    // Titles & Subtitles (used for breadcrumbs)
    'graphic.title': 'Graphic AI',
    'graphic.subtitle': 'Graphic AI Workspace',
    'content.title': 'Content AI',
    'content.subtitle': 'Content AI Workspace',
    'prompt.title': 'Prompt Lab',
    'prompt.subtitle': 'Prompt Lab Workspace',

    // Tabs
    'tab.generate': 'Generate',
    'tab.edit': 'Edit',
    'tab.analyze': 'Analyze',
    'tab.simple_post': 'Simple Post',

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
    'label.layout': 'Layout Style',
    'label.theme': 'Background Theme',
    
    // Labels - Simple Social Post
    'label.logo': 'Brand Logo',
    'label.bg_image': 'Background Image (Optional)',
    'label.headline': 'Main Headline',
    'label.tagline': 'Tagline / Slogan',
    'label.content': 'Main Body Content',
    'label.address': 'Physical Address',
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

    // Labels - Prompt Lab
    'label.template': 'Assistant Template',
    'label.systemInstruction': 'System Instruction',
    'label.draft': 'Input / Draft',
    'label.complexity': 'Complexity Level',
    'tag.persona': 'PERSONA & RULES',

    // Categories
    'cat.social': 'Social Media',
    'cat.standard': 'Standard Ratios',

    // Personas
    'persona.general': 'General Assistant',
    'persona.tech': 'Tech Expert',
    'persona.fitness': 'Fitness Guru',
    'persona.business': 'Business Consultant',
    'persona.creative': 'Creative Writer',
    'persona.marketer': 'Digital Marketer',
    'persona.influencer': 'Social Influencer',
    'persona.academic': 'Academic Researcher',

    // Platforms
    'plat.facebook': 'Facebook',
    'plat.instagram': 'Instagram',
    'plat.twitter': 'Twitter/X',
    'plat.linkedin': 'LinkedIn',
    'plat.blog': 'Blog Post',
    'plat.email': 'Email',
    'plat.youtube': 'YouTube',
    'plat.tiktok': 'TikTok',

    // Tones
    'tone.pro': 'Professional',
    'tone.casual': 'Casual',
    'tone.witty': 'Witty',
    'tone.urgent': 'Urgent',
    'tone.empathetic': 'Empathetic',
    'tone.educational': 'Educational',
    'tone.inspiring': 'Inspiring',

    // Lengths
    'len.short': 'Short',
    'len.medium': 'Medium',
    'len.long': 'Long',

    // Templates
    'temp.promptWriter': 'Prompt Architect',
    'temp.code': 'Code Refactor',
    'temp.linguist': 'Linguistic Expert',
    'temp.writer': 'Story Teller',
    'temp.midjourney': 'Photo Director',
    'temp.marketing': 'Copywriter',

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
    'btn.image_to_prompt': 'Describe Image to Prompt',
    'btn.clear_result': 'Clear Result',

    // Results & Status
    'result.title.prompt': 'Result',
    'result.title.generate': 'Visual Result',
    'result.title.analyze': 'Art Director Report',
    'result.title.content': 'Generated Content',
    'result.processing': 'Lumina is processing...',
    'result.ready': 'Awaiting input...',

    // CTA Options
    'opt.phone': 'Phone Number',
    'opt.email': 'Email Address',
    'opt.template.load': 'Choose Template...',
    'opt.yes': 'Yes',
    'opt.no': 'No',
    'opt.comp.concise': 'Concise',
    'opt.comp.detailed': 'Detailed',
    'opt.comp.cot': 'Chain of Thought',
    'opt.imageGen': 'Image Prompt',
    'opt.textGen': 'Text Content',

    // Upload & MultiUpload
    'upload.label': 'SOURCE IMAGE',
    'upload.click_drop': 'Upload Image',
    'upload.replace': 'Replace',
    'upload.remove': 'Remove',
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

    // Titles & Subtitles
    'graphic.title': 'Graphic AI (ဂရပ်ဖစ်)',
    'content.title': 'Content AI (စာပေ)',
    'prompt.title': 'Prompt Lab (အမိန့်ပေးစာ)',

    // Home
    'home.graphic.title': 'Graphic AI (ဂရပ်ဖစ်)',
    'home.graphic.desc': 'ပရော်ဖက်ရှင်နယ် ပုံဖန်တီးခြင်း၊ ပြင်ဆင်ခြင်း နှင့် သုံးသပ်ခြင်း။',
    'home.content.title': 'Content AI (စာပေ)',
    'home.content.desc': 'ဆောင်းပါး၊ စာတို နှင့် စာပေအမျိုးမျိုး ဖန်တီးရန်။',
    'home.prompt.title': 'Prompt Lab (အမိန့်ပေးစာ)',
    'home.prompt.desc': 'သာမန် စိတ်ကူးများကို အဆင့်မြင့် Prompt များအဖြစ် ပြောင်းလဲပါ။',

    // Tabs
    'tab.generate': 'ပုံထုတ်လုပ်မည်',
    'tab.edit': 'ပုံပြင်ဆင်မည်',
    'tab.analyze': 'သုံးသပ်မည်',
    'tab.simple_post': 'ကြော်ငြာပုံစံ',

    // Categories
    'cat.social': 'ဆိုရှယ်မီဒီယာ',
    'cat.standard': 'ပုံမှန်အချိုးအစား',

    // Personas
    'persona.general': 'အထွေထွေ အကူအညီ',
    'persona.tech': 'နည်းပညာ ကျွမ်းကျင်သူ',

    // Labels
    'label.prompt': 'ပုံဖော်ရန် ဖော်ပြချက်',
    'label.logo': 'အမှတ်တံဆိပ် (Logo)',
    'label.bg_image': 'နောက်ခံပုံ (လိုလျှင်)',
    'label.headline': 'ခေါင်းစဉ်ကြီး',
    'label.tagline': 'ဆောင်ပုဒ်',
    'label.content': 'စာသား အချက်အလက်',
    'label.address': 'တည်နေရာ လိပ်စာ',
    'label.cta': 'ဆက်သွယ်ရန်',
    'btn.image_to_prompt': 'ပုံမှ စာသားအဖြစ်ပြောင်းမည်',
    'btn.clear_result': 'ရလဒ်ဖျက်မည်',

    // Upload
    'upload.label': 'မူလပုံ တင်ရန်',
    'upload.click_drop': 'ပုံ တင်ရန် နှိပ်ပါ',
    'upload.replace': 'ပုံ ပြောင်းရန်',
    'upload.remove': 'ဖယ်ရှားမည်',
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
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('lumina_lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lumina_lang', language);
  }, [language]);

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
