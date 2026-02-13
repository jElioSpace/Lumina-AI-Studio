import { GoogleGenAI } from "@google/genai";
import { ImageGenerationConfig, ImageEditConfig, ImageAnalyzeConfig, ContentGenerationConfig, SimplePostConfig, ImageCollageConfig } from "../types";

const getSizeConfig = (sizeInput: string): { aspectRatio: string | undefined } => {
  if (!sizeInput || sizeInput === 'original') return { aspectRatio: undefined };
  const nativeRatios = ["1:1", "16:9", "9:16", "4:3", "3:4"];
  if (nativeRatios.includes(sizeInput)) return { aspectRatio: sizeInput };
  let mappedRatio = "1:1"; 
  if (sizeInput === "1080x1080") mappedRatio = "1:1";
  else if (sizeInput === "1080x1350") mappedRatio = "3:4";
  else if (sizeInput === "1080x1920") mappedRatio = "9:16";
  else if (sizeInput === "1280x720") mappedRatio = "16:9";
  else if (sizeInput === "4:5") mappedRatio = "3:4"; 
  return { aspectRatio: mappedRatio };
};

export const describeImageForPrompt = async (imgBase64: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Data = imgBase64.split(',')[1];
  const mimeType = imgBase64.split(';')[0].split(':')[1];
  const prompt = "Act as an expert Prompt Engineer. Describe this image in extreme detail for use as a prompt in an AI Image Generator. Include subjects, environment, lighting, camera settings, art style, and emotional mood. Provide ONLY the final prompt text.";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Data, mimeType: mimeType } }, { text: prompt }] }
    });
    return response.text || "Failed to describe image.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to analyze image.");
  }
};

export const generateImage = async (config: ImageGenerationConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio } = getSizeConfig(config.size);
  let finalPrompt = config.prompt;
  if (config.referenceImages?.length > 0) finalPrompt = `[Structure: Use reference images as composition guides] ${finalPrompt}`;
  if (config.style && config.style !== 'None') finalPrompt += `, Style: ${config.style}`;
  if (config.mood && config.mood !== 'None') finalPrompt += `, Mood: ${config.mood}`;
  if (config.lighting && config.lighting !== 'None') finalPrompt += `, Lighting: ${config.lighting}`;
  if (config.colorGrade && config.colorGrade !== 'None') finalPrompt += `, Color Grade: ${config.colorGrade}`;
  if (config.negativePrompt) finalPrompt += `, Exclude: ${config.negativePrompt}`;
  const parts: any[] = (config.referenceImages || []).map(img => ({
    inlineData: { data: img.split(',')[1], mimeType: img.split(';')[0].split(':')[1] }
  }));
  parts.push({ text: finalPrompt });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" }, seed: config.seed }
    });
    const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imgPart?.inlineData) return `data:image/png;base64,${imgPart.inlineData.data}`;
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate image.");
  }
};

export const generateSimpleSocialPost = async (config: SimplePostConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio } = getSizeConfig(config.size);
  const formattedCTAs = config.ctas.filter(c => c.value.trim() !== '').map(c => `${c.type === 'phone' ? 'Ph:' : 'Email:'} ${c.value}`).join(' | ');
  
  const finalPrompt = `
    Task: Create a professional social media graphic.
    STRICT RULE: ONLY use the information provided below. DO NOT invent logos, headings, or taglines if they are empty.
    Elements to include:
    ${config.headline ? `Main Headline: "${config.headline}"` : ''}
    ${config.tagline ? `Secondary Tagline: "${config.tagline}"` : ''}
    ${config.content ? `Body Text: "${config.content}"` : ''}
    ${config.address ? `Location/Address: "${config.address}"` : ''}
    ${formattedCTAs ? `Contact: "${formattedCTAs}"` : ''}
    
    Aesthetic: ${config.theme || 'Modern'}
    Background: ${config.backgroundImage ? 'USE PROVIDED BACKGROUND' : 'Clean abstract background'}
    If only background and address provided, just overlay the address beautifully on the image.
  `;

  const parts: any[] = [];
  if (config.backgroundImage) parts.push({ inlineData: { data: config.backgroundImage.split(',')[1], mimeType: config.backgroundImage.split(';')[0].split(':')[1] } });
  if (config.logo) parts.push({ inlineData: { data: config.logo.split(',')[1], mimeType: config.logo.split(';')[0].split(':')[1] } });
  parts.push({ text: finalPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } }
    });
    const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imgPart?.inlineData) return `data:image/png;base64,${imgPart.inlineData.data}`;
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate post.");
  }
};

export const generateCollage = async (config: ImageCollageConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio } = getSizeConfig(config.size);
  const parts: any[] = config.images.map(img => ({
    inlineData: { data: img.split(',')[1], mimeType: img.split(';')[0].split(':')[1] }
  }));
  parts.push({ text: `Create a professional ${config.layout} collage with a ${config.theme} theme. ${config.prompt || ''}` });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } }
    });
    const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imgPart?.inlineData) return `data:image/png;base64,${imgPart.inlineData.data}`;
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate collage.");
  }
};

export const editImage = async (config: ImageEditConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const { aspectRatio } = getSizeConfig(config.size || 'original');
  const base64 = config.sourceImage!.split(',')[1];
  const mime = config.sourceImage!.split(';')[0].split(':')[1];
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: config.prompt }] },
      config: { imageConfig: { aspectRatio: aspectRatio || "1:1" } }
    });
    const imgPart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (imgPart?.inlineData) return `data:image/png;base64,${imgPart.inlineData.data}`;
    throw new Error("No image data found.");
  } catch (error: any) {
    throw new Error(error.message || "Failed to edit image.");
  }
};

export const analyzeImage = async (config: ImageAnalyzeConfig & { language?: string }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64 = config.sourceImage!.split(',')[1];
  const mime = config.sourceImage!.split(';')[0].split(':')[1];
  const prompt = `Act as an expert Art Director. Analyze this image. Context: ${config.prompt || 'General review'}. ${config.language === 'mm' ? 'Reply in Myanmar language.' : 'Reply in English.'}`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64, mimeType: mime } }, { text: prompt }] }
    });
    return response.text || "No analysis generated.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to analyze.");
  }
};

export const generateTextContent = async (config: ContentGenerationConfig & { language?: string }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = (config.referenceImages || []).map(img => ({
    inlineData: { data: img.split(',')[1], mimeType: img.split(';')[0].split(':')[1] }
  }));
  parts.push({ text: `Act as ${config.creatorPersona}. Topic: ${config.topic}. Platform: ${config.platform}. Tone: ${config.tone}. ${config.additionalContext || ''} ${config.language === 'mm' ? 'Respond in Myanmar.' : ''}` });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    return response.text || "No content generated.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to generate text.");
  }
};

export const craftPrompt = async (draft: string, target: 'image' | 'text', complexity: string, baseInstruction?: string, referenceImages: string[] = []): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const parts: any[] = referenceImages.map(img => ({
    inlineData: { data: img.split(',')[1], mimeType: img.split(';')[0].split(':')[1] }
  }));
  parts.push({ text: `System: ${baseInstruction || 'General Assistant'}. Complexity: ${complexity}. User Input: ${draft}` });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts }
    });
    return response.text || "Failed to craft prompt.";
  } catch (error: any) {
    throw new Error(error.message || "Failed to craft prompt.");
  }
};
