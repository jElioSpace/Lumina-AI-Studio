
export enum AspectRatio {
  Square = "1:1",
  Portrait34 = "3:4",
  Landscape43 = "4:3",
  Portrait916 = "9:16",
  Landscape169 = "16:9",
}

export enum GenerationMode {
  Generate = "generate",
  Edit = "edit",
  Analyze = "analyze",
  SimplePost = "simple_post",
  Collage = "collage"
}

export interface ImageGenerationConfig {
  prompt: string;
  style: string;
  mood: string;
  lighting: string;
  size: string; // Combined size/ratio selection
  camera: string;
  colorGrade: string;
  negativePrompt: string;
  seed: number | undefined;
  referenceImages: string[]; // Up to 3 images
}

export interface ImageCollageConfig {
  prompt: string;
  images: string[]; // Up to 6 images
  layout: string;
  theme: string;
  size: string;
}

export interface ImageEditConfig {
  prompt: string;
  sourceImage: string | null; // Base64
  mood?: string;
  size?: string;
}

export interface ImageAnalyzeConfig {
  prompt: string;
  sourceImage: string | null; // Base64
}

export interface SimplePostCTA {
  type: 'phone' | 'email';
  value: string;
}

export interface SimplePostConfig {
  logo: string | null; // Base64
  backgroundImage?: string | null; // Base64
  headline: string;
  tagline: string;
  content: string;
  address?: string;
  ctas: SimplePostCTA[];
  size: string;
  // Added theme property to resolve 'theme' does not exist on type 'SimplePostConfig' errors
  theme?: string;
}

export interface ContentGenerationConfig {
  pageName: string;
  creatorPersona: string;
  topic: string;
  platform: string;
  targetAudience: string;
  tone: string;
  length: string;
  useEmojis: boolean;
  referenceUrls: string[];
  referenceImages: string[];
  additionalContext: string;
}

export interface GeneratedResult {
  imageUrl?: string;
  text?: string;
  error?: string;
  loading: boolean;
}

export interface HistoryItem {
  id: string;
  type: 'image' | 'text' | 'analysis';
  prompt: string;
  result: string; // URL for image, Text content for text/analysis
  timestamp: number;
}