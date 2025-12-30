import { GoogleGenAI } from "@google/genai";

// ✅ Vite uses import.meta.env and variables must start with VITE_
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const getMangoAssistantResponse = async (userMessage: string) => {
  // ✅ don’t crash if key missing
  if (!apiKey) {
    return "AI is disabled because the API key is not set.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userMessage,
    });

    // SDK response shape can vary, this is the common way to read text
    return (response as any)?.text ?? "No response received.";
  } catch (err) {
    console.log("Gemini error:", err);
    return "AI is temporarily unavailable.";
  }
};
