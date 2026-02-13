// Graphic AI Options
export const STYLE_HIERARCHY: Record<string, string[]> = {
  'None': ['None'],
  'Photography': ['None', 'Cinematic', 'Portrait', 'Macro', 'Street Photography', 'Bokeh', 'Editorial'],
  'Digital Art': ['None', 'Digital Painting', 'Concept Art', 'Matte Painting', 'Vector Art', 'Low-poly'],
  'Fine Art': ['None', 'Oil Painting', 'Acrylic', 'Watercolor', 'Pencil Sketch', 'Charcoal', 'Impressionism', 'Abstract'],
  'Illustration': ['None', 'Children’s Book', 'Comic Book', 'Graphic Novel', 'Line Art', 'Botantical'],
  '3D & Render': ['None', 'Unreal Engine 5', 'Octane Render', 'Isometric 3D', 'Hyper-realistic', 'Claymorphism'],
  'Anime & Manga': ['None', 'Anime', 'Manga', 'Studio Ghibli Style', 'Chibi'],
  'Vintage & Retro': ['None', '1980s Synthwave', '1950s Poster', 'Noir', 'Vaporwave', 'Pixel Art'],
  'Design & Corporate': ['None', 'Minimalist', 'Flat Design', 'Corporate Memphis', 'UI/UX Mockup', 'Architectural'],
  'Atmospheric': ['None', 'Ethereal', 'Dark Fantasy', 'Cyberpunk', 'Steampunk', 'Surrealism']
};

export const MOOD_MAP = {
  'None': 'opt.none',
  'Calm': 'mood.calm',
  'Energetic': 'mood.energetic',
  'Dark': 'mood.dark',
  'Playful': 'mood.playful',
  'Elegant': 'mood.elegant',
  'Cozy': 'mood.cozy',
  'Professional': 'mood.professional',
  'Ethereal': 'mood.ethereal',
  'Melancholic': 'mood.melancholic',
  'Romantic': 'mood.romantic',
};

export const LIGHTING_MAP = {
  'Natural': 'light.natural',
  'Studio Soft Light': 'light.studio',
  'Cinematic Soft Light': 'light.cinematic',
  'Strong Contrast': 'light.rembrandt',
  'Warm Golden Light': 'light.golden',
  'Glow / Neon Accent Light': 'light.neon',
  'Ambient Lighting': 'light.ambient',
  'Low Key Lighting': 'light.lowkey',
  'Flat Lighting': 'light.flat',
};

// Content AI Options
export const PERSONA_MAP = {
  'General': 'persona.general',
  'Tech Expert': 'persona.tech',
  'Fitness Guru': 'persona.fitness',
  'Business Consultant': 'persona.business',
  'Creative Writer': 'persona.creative',
  'Digital Marketer': 'persona.marketer',
  'Influencer': 'persona.influencer',
  'Academic': 'persona.academic',
};

export const PLATFORM_MAP = {
  'Facebook': 'plat.facebook',
  'Instagram': 'plat.instagram',
  'Twitter/X': 'plat.twitter',
  'LinkedIn': 'plat.linkedin',
  'Blog Post': 'plat.blog',
  'Email': 'plat.email',
  'YouTube': 'plat.youtube',
  'TikTok': 'plat.tiktok',
};