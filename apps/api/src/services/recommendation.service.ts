import {
  recommendDishes,
  type Dish,
  type RecommendationPreferences,
  type RecommendationResult,
  type ScoredDish,
} from "@olea/menu-data";
import { isLlmEnabled } from "../env";
import { getDishes } from "../repositories/menu.repository";
import { generateRecommendation } from "./gemini";

/** Friendly fallback reply built from the rule-based engine's output. */
function buildRuleReply(scored: ScoredDish[]): string {
  if (scored.length === 0) {
    return "I couldn't find a match for that — try loosening one preference and I'll look again.";
  }
  const top = scored[0].dish.name;
  const count = scored.length;
  return `Based on your taste, here ${count === 1 ? "is a dish" : `are ${count} dishes`} I think you'll love — starting with the ${top}.`;
}

/**
 * Produces dish recommendations. Uses Gemini when a key is configured (it both
 * picks the dishes and writes the reply); otherwise — or on any LLM error — it
 * falls back to the deterministic rule-based engine from the shared package.
 */
export async function recommend(
  preferences: RecommendationPreferences,
  message?: string,
  limit = 3,
): Promise<RecommendationResult> {
  const menu = await getDishes();
  const ruleBased = recommendDishes(preferences, menu, limit);

  if (isLlmEnabled) {
    try {
      const { dishIds, reply } = await generateRecommendation({
        menu,
        preferences,
        message,
        limit,
      });
      const byId = new Map(menu.map((dish) => [dish.id, dish]));
      const picked = dishIds
        .map((id) => byId.get(id))
        .filter((dish): dish is Dish => Boolean(dish))
        .slice(0, limit);

      if (picked.length > 0) {
        const recommendations: ScoredDish[] = picked.map((dish) => ({
          dish,
          score: 0,
          reasons: [],
        }));
        return { recommendations, reply, source: "llm" };
      }
    } catch (error) {
      console.error("LLM recommendation failed; falling back to rules:", error);
    }
  }

  return {
    recommendations: ruleBased,
    reply: buildRuleReply(ruleBased),
    source: "rules",
  };
}
