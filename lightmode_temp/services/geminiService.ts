import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // In a real app, this should be handled more securely or via backend proxy
    // Using process.env.API_KEY as per instructions
    const apiKey = process.env.API_KEY || '';
    if (apiKey) {
        aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

export const improveTextWithGemini = async (text: string): Promise<string> => {
  const client = getAiClient();
  if (!client) {
    return "Error: API Key not configured. Please check environment variables.";
  }

  try {
    const prompt = `
      Act as an expert Uzbek linguist and editor. 
      Analyze the following text and improve its grammar, spelling, and flow while maintaining the original meaning.
      If the text is in Cyrillic, keep it in Cyrillic. If it is in Latin, keep it in Latin.
      Only provide the corrected text as the output, no explanations.
      
      Text: "${text}"
    `;

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Fallback to original text on error
  }
};