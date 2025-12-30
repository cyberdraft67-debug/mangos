
import { GoogleGenAI } from "@google/genai";

/**
 * Returns the AI assistant response text.
 * Strictly adheres to Gemini API guidelines using process.env.API_KEY.
 */
export async function getMangoAssistantResponse(userMessage: string): Promise<string> {
  // Initialize the AI client with the global API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
      config: {
        systemInstruction: "You are the 'Chaunsa Gold Concierge', a world-class expert on Chaunsa mangoes. Provide high-end recipe suggestions, historical facts, and storage tips. Keep responses elegant, sophisticated, and helpful.",
      }
    });

    // Directly access the .text property as per SDK requirements
    const text = response.text;

    return text || "The concierge is momentarily unavailable. Please try again.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "The royal concierge is attending to other guests. Please try again shortly.";
  }
}
