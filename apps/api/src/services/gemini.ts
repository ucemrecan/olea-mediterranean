import type { Dish, RecommendationPreferences } from "@olea/menu-data";
import { GoogleGenAI, Type } from "@google/genai";
import { env } from "../env";

/**
 * The only LLM-aware module. It asks Gemini to pick dishes from the menu and
 * write a friendly reply, returning structured JSON. The rest of the app stays
 * provider-agnostic. Throws if no key is configured or the call fails — callers
 * fall back to the rule-based engine.
 */

export interface LlmRecommendation {
  dishIds: string[];
  reply: string;
}

const SYSTEM_INSTRUCTION = `You are the table assistant for Olea, a modern Mediterranean restaurant.
Recommend dishes ONLY from the provided menu, using each dish's id.
Strictly respect the guest's dietary preference. Honour their other preferences
(spice, mood, occasion, course, budget) and any free-text note when possible.
Pick the best matches (at most the requested limit). Write a warm, concise reply
(1–2 sentences, no lists) that introduces the picks. Never invent dishes.`;

/** Compact menu projection sent to the model — only what it needs to choose. */
function menuForPrompt(menu: Dish[]) {
  return menu.map((dish) => ({
    id: dish.id,
    name: dish.name,
    description: dish.description,
    category: dish.category,
    dietaryTags: dish.dietaryTags,
    spiceLevel: dish.spiceLevel,
    priceTier: dish.priceTier,
    moods: dish.moods,
    occasions: dish.occasions,
  }));
}

export async function generateRecommendation(input: {
  menu: Dish[];
  preferences: RecommendationPreferences;
  message?: string;
  limit: number;
}): Promise<LlmRecommendation> {
  if (!env.gemini.apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey: env.gemini.apiKey });

  const prompt = [
    `Menu (JSON): ${JSON.stringify(menuForPrompt(input.menu))}`,
    `Guest preferences (JSON): ${JSON.stringify(input.preferences)}`,
    input.message ? `Guest note: ${input.message}` : null,
    `Return at most ${input.limit} dish ids.`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const response = await ai.models.generateContent({
    model: env.gemini.model,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          dishIds: { type: Type.ARRAY, items: { type: Type.STRING } },
          reply: { type: Type.STRING },
        },
        required: ["dishIds", "reply"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  const parsed = JSON.parse(text) as LlmRecommendation;
  if (!Array.isArray(parsed.dishIds) || typeof parsed.reply !== "string") {
    throw new Error("Gemini returned an unexpected shape");
  }
  return parsed;
}
