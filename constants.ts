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

export const COLOR_GRADE_OPTIONS = [
  { label: 'None', value: 'None' },
  { label: 'Vibrant', value: 'Vibrant' },
  { label: 'Muted', value: 'Muted' },
  { label: 'Warm', value: 'Warm' },
  { label: 'Cool', value: 'Cool' },
  { label: 'Sepia', value: 'Sepia' },
  { label: 'Black & White', value: 'Black & White' },
  { label: 'Teal & Orange', value: 'Teal & Orange' },
  { label: 'Technicolor', value: 'Technicolor' },
  { label: 'Kodak Portra', value: 'Kodak Portra' },
  { label: 'Fujifilm Pro', value: 'Fujifilm Pro' }
];

export const LIGHTING_OPTIONS = [
  { label: 'Natural', value: 'Natural' },
  { label: 'Studio Soft Light', value: 'Studio Soft Light' },
  { label: 'Cinematic Soft Light', value: 'Cinematic Soft Light' },
  { label: 'Rembrandt', value: 'Strong Contrast' },
  { label: 'Golden Hour', value: 'Warm Golden Light' },
  { label: 'Neon Accent', value: 'Glow / Neon Accent Light' },
  { label: 'Moonlight', value: 'Soft Moonlight' },
  { label: 'Flash Photography', value: 'Harsh Flash' }
];

export const CAMERA_OPTIONS = [
  { label: 'None', value: 'None' },
  { label: 'Eye Level', value: 'Eye Level' },
  { label: 'Low Angle', value: 'Low Angle' },
  { label: 'High Angle', value: 'High Angle' },
  { label: 'Bird\'s Eye View', value: 'Bird\'s Eye View' },
  { label: 'Drone / Aerial', value: 'Aerial Shot' },
  { label: 'Dutch Angle', value: 'Dutch Angle' },
  { label: 'Extreme Close Up', value: 'Extreme Close Up' }
];

export const LENS_OPTIONS = [
  { label: 'None', value: 'None' },
  { label: '35mm Wide', value: '35mm Lens' },
  { label: '50mm Prime', value: '50mm Prime Lens' },
  { label: '85mm Portrait', value: '85mm Portrait Lens' },
  { label: 'Telephoto', value: 'Telephoto Lens' },
  { label: 'Wide Angle', value: 'Wide Angle Lens' },
  { label: 'Fish Eye', value: 'Fish Eye Lens' },
  { label: 'Anamorphic', value: 'Anamorphic Lens' }
];

export const FOCUS_OPTIONS = [
  { label: 'None', value: 'None' },
  { label: 'Deep Focus', value: 'Deep Focus' },
  { label: 'Shallow Focus', value: 'Shallow Focus (Bokeh)' },
  { label: 'Sharp Focus', value: 'Sharp Focus' },
  { label: 'Soft Focus', value: 'Soft Focus' },
  { label: 'Motion Blur', value: 'Motion Blur' }
];

export const COLLAGE_LAYOUTS = [
  { label: 'Balanced Grid', value: 'Balanced Grid' },
  { label: 'Vertical Stack', value: 'Vertical Stack' },
  { label: 'Horizontal Stack', value: 'Horizontal Stack' },
  { label: 'Creative Grid', value: 'Creative Grid' },
  { label: 'Asymmetric Mix', value: 'Asymmetric Mix' },
  { label: 'Overlap Collage', value: 'Overlap Collage' },
  { label: 'Circular Radial', value: 'Circular Radial' }
];

export const SIMPLE_POST_THEMES = [
  { label: 'Clean Minimalist', value: 'Clean Minimalist' },
  { label: 'Modern Corporate', value: 'Modern Corporate' },
  { label: 'Luxury & Gold', value: 'Luxury & Gold' },
  { label: 'Bold Typography', value: 'Bold Typography' },
  { label: 'Pastel Dream', value: 'Pastel Dream' },
  { label: 'Cyberpunk Industrial', value: 'Cyberpunk Industrial' },
  { label: 'Nature Inspired', value: 'Nature Inspired' },
  { label: 'Abstract Geometric', value: 'Abstract Geometric' },
  { label: 'Street Style', value: 'Street Style' }
];

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
