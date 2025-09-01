
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
      description: "A detailed and accurate answer to the user's question, formatted for a BCA student."
    },
    suggestions: {
      type: Type.ARRAY,
      description: "Three relevant follow-up questions a student might ask.",
      items: {
        type: Type.STRING
      }
    }
  },
  required: ["answer", "suggestions"]
};

export const getAnswerAndSuggestions = async (prompt: string): Promise<{ answer: string; suggestions: string[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Question: "${prompt}"`,
      config: {
        systemInstruction: `You are an expert AI tutor for students pursuing a Bachelor of Computer Applications (BCA). Your primary goal is to provide clear, accurate, and easy-to-understand answers to their computer science questions. When a user asks a question, you must provide a comprehensive answer and then suggest three relevant follow-up questions to encourage deeper learning. Always respond in the JSON format defined by the schema.`,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);
    
    if (parsedResponse.answer && Array.isArray(parsedResponse.suggestions)) {
        return parsedResponse;
    } else {
        throw new Error("Invalid JSON structure received from API.");
    }
    
  } catch (error) {
    console.error("Gemini API call failed:", error);
     if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
          throw new Error("Your API key is invalid. Please check your configuration.");
        }
      }
    throw new Error("Failed to get a response from the AI. The service may be temporarily unavailable.");
  }
};