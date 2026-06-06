import type { Category, Dish, Mood, Occasion, PriceTier } from "./types";

/**
 * Visitor preferences gathered by the assistant. Every field is optional so the
 * engine can score with partial input.
 */
export interface RecommendationPreferences {
  diet?: "vegan" | "vegetarian" | "pescatarian" | "no-restriction";
  spice?: "mild" | "medium" | "spicy" | "any";
  mood?: Mood;
  occasion?: Occasion;
  course?: Category | "any";
  budget?: PriceTier | "any";
}

export interface ScoredDish {
  dish: Dish;
  score: number;
  /** Short, human-readable reasons used by the assistant UI. */
  reasons: string[];
}

/**
 * The assistant's full response: the picked dishes plus a natural-language
 * reply. `source` records whether an LLM or the rule-based engine produced it,
 * so the UI (and tests) can tell the two paths apart.
 */
export interface RecommendationResult {
  recommendations: ScoredDish[];
  reply: string;
  source: "llm" | "rules";
}

/** Maps a spice preference to its target dish spice level. */
const SPICE_TARGET: Record<"mild" | "medium" | "spicy", number> = {
  mild: 0,
  medium: 2,
  spicy: 3,
};

/**
 * Hard dietary filter. A dish is only eligible if it can be served to someone
 * with the given diet.
 */
function matchesDiet(dish: Dish, diet: RecommendationPreferences["diet"]): boolean {
  switch (diet) {
    case "vegan":
      return dish.dietaryTags.includes("vegan");
    case "vegetarian":
      return (
        dish.dietaryTags.includes("vegetarian") ||
        dish.dietaryTags.includes("vegan")
      );
    case "pescatarian":
      return !dish.dietaryTags.includes("contains-meat");
    case "no-restriction":
    case undefined:
    default:
      return true;
  }
}

/**
 * Scores a single dish against the preferences. Higher is better. Soft signals
 * accumulate points and attach a reason so the assistant can explain itself.
 */
function scoreDish(
  dish: Dish,
  prefs: RecommendationPreferences,
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Spice alignment — closer to the target level scores higher.
  if (prefs.spice && prefs.spice !== "any") {
    const target = SPICE_TARGET[prefs.spice];
    const distance = Math.abs(dish.spiceLevel - target);
    score += Math.max(0, 3 - distance) * 2;
    if (distance === 0) {
      reasons.push(`a ${prefs.spice} spice level, just as you like`);
    }
  }

  // Mood alignment.
  if (prefs.mood && dish.moods.includes(prefs.mood)) {
    score += 4;
    reasons.push(`${prefs.mood} on the palate`);
  }

  // Occasion alignment.
  if (prefs.occasion && dish.occasions.includes(prefs.occasion)) {
    score += 3;
    reasons.push(`a fit for a ${prefs.occasion} table`);
  }

  // Course preference.
  if (prefs.course && prefs.course !== "any" && dish.category === prefs.course) {
    score += 3;
  }

  // Budget — within budget scores, over budget is penalised lightly.
  if (prefs.budget && prefs.budget !== "any") {
    if (dish.priceTier <= prefs.budget) {
      score += 2;
      if (dish.priceTier < prefs.budget) {
        reasons.push("easy on the budget");
      }
    } else {
      score -= 2;
    }
  }

  // Featured dishes get a small nudge so signatures surface on thin input.
  if (dish.featured) {
    score += 1;
  }

  return { score, reasons };
}

/**
 * Returns the best dishes for the given preferences, highest score first.
 *
 * This is the single decision point that a real backend or LLM would later
 * replace — the assistant UI only depends on its shape, not its internals.
 */
export function recommendDishes(
  prefs: RecommendationPreferences,
  menu: Dish[],
  limit = 3,
): ScoredDish[] {
  return menu
    .filter((dish) => matchesDiet(dish, prefs.diet))
    .map((dish) => {
      const { score, reasons } = scoreDish(dish, prefs);
      return { dish, score, reasons };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
