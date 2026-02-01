
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, Task } from "../types";

// Always use the API_KEY directly from env
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const getStudyAnalysis = async (subjects: Subject[], tasks: Task[]) => {
  const prompt = `
    Analyze this student's performance and provide a strategy.
    Subjects: ${JSON.stringify(subjects)}
    Tasks: ${JSON.stringify(tasks)}
    
    ICA (In-Course Assessment) is 30%, Final Exam is 70%.
    Identify subjects needing more focus and provide 3 actionable tips.
    Format your response as a JSON object.
  `;

  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
      throw new Error("Missing Gemini API Key. Please add it to client/.env.local");
    }
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            focusOrder: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Subject names in order of urgency"
            },
            summary: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["focusOrder", "summary", "tips"]
        }
      }
    });

    // Access response.text as a property, not a method, and handle undefined
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      focusOrder: subjects.map(s => s.name),
      summary: "Could not generate AI analysis. Review your subjects manually.",
      tips: ["Complete all ICAs", "Set specific revision goals", "Maintain a consistent streak"]
    };
  }
};
