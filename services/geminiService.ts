import { GoogleGenAI, Type, Schema } from "@google/genai";
import { FlashcardSet } from '../types';

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wordSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING },
    phonetic: { type: Type.STRING, description: "IPA phonetic transcription" },
    translation: { type: Type.STRING, description: "Chinese translation (Hanzi only, NO Pinyin)" },
    chineseDefinition: { type: Type.STRING, description: "Concise definition in Chinese. Wrap keywords in **double asterisks**." },
    chineseMnemonic: { type: Type.STRING, description: "A creative memory aid in Chinese. Wrap key associations in **double asterisks**." },
    examples: { 
      type: Type.ARRAY, 
      description: "One simple example sentence, bilingual.",
      items: { 
        type: Type.OBJECT,
        properties: {
            en: { type: Type.STRING, description: "English sentence. Wrap the target word in **double asterisks**." },
            cn: { type: Type.STRING, description: "Chinese translation. Wrap the translation of the target word in **double asterisks**." }
        },
        required: ["en", "cn"]
      }
    }
  },
  required: ["word", "phonetic", "translation", "chineseDefinition", "chineseMnemonic", "examples"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    words: {
      type: Type.ARRAY,
      items: wordSchema
    }
  }
};

export const generateCardContent = async (input: string): Promise<FlashcardSet> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create a flashcard set for the following words: "${input}". 
      If the user provides a comma-separated list, generate details for ALL words in the list (max 3-4 words best).
      1. Translation: Chinese characters only.
      2. Definition & Mnemonic: Must be in CHINESE.
      3. Examples: Provide 1 bilingual example.
      4. IMPORTANT: In definitions, mnemonics, and examples, wrap the target word (or its translation/keyword) in **double asterisks** (e.g., **word**) for highlighting.
      Ensure the output JSON strictly matches the schema.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini");
    }

    const data = JSON.parse(text);

    return {
      id: Date.now().toString(),
      createdAt: Date.now(),
      words: data.words
    };
  } catch (error) {
    console.error("Error generating flashcard:", error);
    throw error;
  }
};