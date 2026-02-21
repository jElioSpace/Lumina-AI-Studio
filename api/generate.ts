// /api/generate.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Use the new 3.1 model and specify the v1beta version
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.1-flash",
  }, { apiVersion: "v1beta" });

  try {
    const { prompt } = req.body;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}