import { GoogleGenAI } from "@google/genai";
import { ImageGenerationConfig, ImageEditConfig, ImageAnalyzeConfig, ContentGenerationConfig, SimplePostConfig, ImageCollageConfig } from "../types";

// Helper to map complex sizes to API supported aspect ratios
const getSizeConfig = (sizeInput: string): { aspectRatio: string | undefined; sizePrompt: string } => {
  if (!sizeInput || sizeInput === 'original') return { aspectRatio: undefined, sizePrompt: "" };

  // Native supported ratios by Gemini models typically
  const nativeRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
  
  if (nativeRatios.includes(sizeInput)) {
    return { aspectRatio: sizeInput, sizePrompt: "" };
  }

  // Mappings for specific resolutions or other ratios to the closest native ratio
  let mappedRatio = "1:1"; 
  
  if (sizeInput === "1080x1080") mappedRatio = "1:1";
  else if (sizeInput === "1080x1350") mappedRatio = "3:4";
  else if (sizeInput === "1080x1920") mappedRatio = "9:16";
  else if (sizeInput === "1280x720") mappedRatio = "16:9";
  else if (sizeInput === "400x400") mappedRatio = "1:1";
  else if (sizeInput === "4:5") mappedRatio = "3:4"; 
  else if (sizeInput === "3:1") mappedRatio = "16:9"; 
  else if (sizeInput === "4:1") mappedRatio = "16:9";
  else if (sizeInput === "21:9") mappedRatio = "16:9";
  else if (sizeInput === "3:2") mappedRatio = "16:9"; 

  return { 
    aspectRatio: mappedRatio, 
    sizePrompt: `, exact resolution/aspect ratio: ${sizeInput.replace('x', '×')}` 
  };
};

export const generateImage = async (config: ImageGenerationConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio, sizePrompt } = getSizeConfig(config.size);
  const hasReferenceImages = config.referenceImages && config.referenceImages.length > 0;

  let finalPrompt = config.prompt;
  if (hasReferenceImages) {
     finalPrompt = `[System Instruction: Replicate the composition and layout of reference images.] ${finalPrompt}`;
  }

  if (config.style && config.style !== 'None') finalPrompt += `, Style: ${config.style}`;
  if (config.mood && config.mood !== 'None') finalPrompt += `, Mood: ${config.mood}`;
  if (config.lighting && config.lighting !== 'None') finalPrompt += `, Lighting: ${config.lighting}`;
  if (config.camera && config.camera !== 'None') finalPrompt += `, View/Camera: ${config.camera}`;
  if (config.colorGrade && config.colorGrade !== 'None') finalPrompt += `, Color Grade: ${config.colorGrade}`;
  if (sizePrompt) finalPrompt += sizePrompt;
  if (config.negativePrompt) finalPrompt += `, Exclude: ${config.negativePrompt}`;

  const parts: any[] = [];
  if (hasReferenceImages) {
    config.referenceImages.forEach(imgBase64 => {
      const base64Data = imgBase64.split(',')[1];
      const mimeType = imgBase64.split(';')[0].split(':')[1];
      parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
    });
  }
  parts.push({ text: finalPrompt });

  const generationConfig: any = {
    imageConfig: { aspectRatio: aspectRatio || "1:1" }
  };
  if (config.seed !== undefined && !isNaN(config.seed)) {
    generationConfig.seed = config.seed;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: generationConfig
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate image.");
  }
};

export const generateCollage = async (config: ImageCollageConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio } = getSizeConfig(config.size);
  
  const parts: any[] = [];
  config.images.forEach(imgBase64 => {
    const base64Data = imgBase64.split(',')[1];
    const mimeType = imgBase64.split(';')[0].split(':')[1];
    parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
  });

  const finalPrompt = `
    Create a professional photo collage using the provided images.
    Layout Style: ${config.layout}.
    Background Theme: ${config.theme}.
    User Instructions: ${config.prompt || 'Arrange these images beautifully.'}
    Ensure high-end composition, professional spacing, and a cohesive aesthetic.
  `;
  parts.push({ text: finalPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No collage data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate collage.");
  }
};

export const generateSimpleSocialPost = async (config: SimplePostConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio } = getSizeConfig(config.size);

  const formattedCTAs = config.ctas
    .filter(cta => cta.value.trim() !== '')
    .map(cta => {
      const emoji = cta.type === 'phone' ? '📞' : '📧';
      return `${emoji} ${cta.value}`;
    })
    .join('  ');

  const finalPrompt = `
    Create a professional, high-end social media graphic for a modern brand.
    Composition Rules:
    - Balanced layout, premium design aesthetic.
    - Typography must be highly legible, clean, and elegant.
    - If a logo is provided, place it prominently (e.g. top corner) and use complementary colors.
    
    Content to include exactly in the graphic design:
    Headline: "${config.headline}"
    Tagline: "${config.tagline}"
    Body Content: "${config.content}"
    Call to Action / Contact Information: "${formattedCTAs}"
    
    Background Style: Minimalist, sophisticated workspace or architectural abstract, matching a high-end corporate or lifestyle brand.
  `;

  const parts: any[] = [];
  if (config.logo) {
    const base64Data = config.logo.split(',')[1];
    const mimeType = config.logo.split(';')[0].split(':')[1];
    parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
  }
  parts.push({ text: finalPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate simple post.");
  }
};

export const editImage = async (config: ImageEditConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  if (!config.sourceImage) throw new Error("Source image required.");
  const { aspectRatio, sizePrompt } = config.size ? getSizeConfig(config.size) : { aspectRatio: undefined, sizePrompt: "" };

  let finalPrompt = config.prompt;
  if (config.mood && config.mood !== 'None') finalPrompt += `, Mood: ${config.mood}`;
  if (sizePrompt) finalPrompt += sizePrompt;

  const base64Data = config.sourceImage.split(',')[1];
  const mimeType = config.sourceImage.split(';')[0].split(':')[1];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: finalPrompt }]
      },
      config: { imageConfig: aspectRatio ? { aspectRatio: aspectRatio } : undefined }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to edit image.");
  }
};

export const analyzeImage = async (config: ImageAnalyzeConfig & { language?: string }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  if (!config.sourceImage) throw new Error("Source image required.");
  const base64Data = config.sourceImage.split(',')[1];
  const mimeType = config.sourceImage.split(';')[0].split(':')[1];
  const languageInstruction = config.language === 'mm' ? "Provide response in Myanmar language." : "";

  const personaPrompt = `Act as a senior Art Director. Review this image. ${languageInstruction} Structure: 1. Executive Summary, 2. Good Points, 3. Points to Fix. User Context: ${config.prompt || "General Analysis"}`;

  try {
    // Using gemini-3-flash-preview for image analysis as it's a basic multimodal task.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: personaPrompt }] }
    });
    return response.text || "No analysis generated.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to analyze.");
  }
};

export const generateTextContent = async (config: ContentGenerationConfig & { language?: string }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const systemInstruction = `You are an expert Content Creator acting as: ${config.creatorPersona}. Goal: High-quality content for ${config.platform}. Tone: ${config.tone}. Length: ${config.length}. Emojis: ${config.useEmojis ? 'Yes' : 'No'}. Language: ${config.language === 'mm' ? 'Myanmar' : 'English'}. Return clean Markdown.`;
  let prompt = `Write content about: "${config.topic}".\n\n`;
  if (config.additionalContext) prompt += `Context: ${config.additionalContext}\n\n`;

  const parts: any[] = [];
  if (config.referenceImages && config.referenceImages.length > 0) {
    config.referenceImages.forEach(img => {
      parts.push({ inlineData: { data: img.split(',')[1], mimeType: img.split(';')[0].split(':')[1] } });
    });
  }
  parts.push({ text: prompt });

  try {
    // Using gemini-3-flash-preview for basic text generation.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: parts },
      config: { systemInstruction: systemInstruction }
    });
    return response.text || "No content generated.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate text.");
  }
};

export const craftPrompt = async (draft: string, target: 'image' | 'text', complexity: string, baseInstruction?: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // The goal is now BRAINSTORMING and TASK EXECUTION based on the persona.
  const systemInstruction = `You are a professional assistant specialized as per the following persona: "${baseInstruction || 'General Assistant'}".
  
  **Your Mission**: 
  1. If the input is code and your persona is an expert (like "Code Refactoring Expert"), REFACTOR the code directly. Provide a complete, clean, and commented solution.
  2. If the persona is "Midjourney Photographer" or similar, brainstorm and provide high-quality image prompts based on the user's idea.
  3. If the input is a general request, act as the persona to provide the best possible output (copywriting, analysis, etc.).
  
  **Complexity**: ${complexity}. 
  - If "Concise", be direct. 
  - If "Detailed", provide thorough explanations or highly descriptive prompts.
  - If "Chain of Thought", think through the problem out loud before providing the final result.
  
  Always return clean, professional output.`;

  try {
    // Using gemini-3-pro-preview for complex reasoning and coding tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [{ text: `User Input: "${draft}"` }]
      },
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "Failed to process request.";
  } catch (error: any) {
    throw new Error(error.message || "Processing failed.");
  }
};