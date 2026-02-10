import { GoogleGenAI, Type, Chat } from "@google/genai";
import { StoicAnalysis, LanguageCode } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    facts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Objective facts extracted from the user's situation.",
    },
    opinions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Subjective interpretations or emotions the user is adding.",
    },
    inControl: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Aspects of the situation the user can directly control.",
    },
    outOfControl: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Aspects of the situation beyond the user's control.",
    },
    verdict: {
      type: Type.STRING,
      description: "Stoic advice and actionable steps.",
    },
  },
  required: ["facts", "opinions", "inControl", "outOfControl", "verdict"],
};

const getLanguageName = (code: LanguageCode): string => {
  switch (code) {
    case 'ID': return "BAHASA INDONESIA";
    case 'EN': return "ENGLISH";
    case 'JP': return "JAPANESE";
    case 'ES': return "SPANISH";
    case 'DE': return "GERMAN";
    default: return "ENGLISH";
  }
};

export const analyzeSituation = async (
  input: string,
  userName: string,
  language: LanguageCode,
  imageBase64?: string,
  isWorstCase: boolean = false
): Promise<StoicAnalysis> => {
  
  const targetLang = getLanguageName(language);

  let systemInstruction = `You are Marcus Aurelius. The user, ${userName}, has come to you. 
  Your goal is to apply Stoic logic to their problem.
  Analyze their input strictly separating facts from opinions. 
  Identify what is in their control (Internal) and what is not (External).
  Provide a verdict that is direct, logical, and encouraging of virtue.
  Do not coddle the user. Focus on Logic over Chaos.
  
  CRITICAL: ENSURE ALL OUTPUT FIELDS ARE IN ${targetLang}.`;

  if (isWorstCase) {
    systemInstruction += `
    PERFORM PREMEDITATIO MALORUM:
    Visualize the absolute worst-case scenario derived from their input.
    Explain why even this worst case is survivable and how to prepare for it mentally.`;
  }

  const model = "gemini-3-pro-preview";
  
  const contents = [];
  
  if (imageBase64) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: imageBase64,
      },
    });
    contents.push({
      text: input || "Analyze this image from a Stoic perspective. What is the reality vs my impression?",
    });
  } else {
    contents.push({ text: input });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
        thinkingConfig: {
          thinkingBudget: 32768, 
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Oracle.");
    
    return JSON.parse(text) as StoicAnalysis;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const createDebateChat = (userName: string, contextData: string, language: LanguageCode): Chat => {
  const targetLang = getLanguageName(language);
  
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: `You are Marcus Aurelius. You are debating with ${userName} regarding the Stoic analysis you just provided.
      
      CONTEXT:
      ${contextData}

      YOUR TASKS:
      1. Defend your Stoic arguments with strong logic.
      2. Do not get angry, stay calm (Stoic), but firm.
      3. Challenge the user's thinking if they still complain about external things.
      4. Answer briefly, concisely, and philosophically.
      
      CRITICAL: SPEAK ONLY IN ${targetLang}.`,
    },
  });
};
