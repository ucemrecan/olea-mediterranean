/**
 * Domain types for the Olea menu.
 *
 * These types are intentionally framework-agnostic. They describe the shape of
 * the menu today (served from mock data) and double as the reference contract
 * for the future REST API, so the frontend never has to change when the data
 * source is swapped.
 */

export type Category = "starters" | "mains" | "seafood" | "desserts" | "drinks";

export type DietaryTag =
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "gluten-free"
  | "dairy-free"
  | "nut-free"
  | "contains-meat"
  | "contains-seafood";

/** 0 = not spicy, 3 = very spicy. */
export type SpiceLevel = 0 | 1 | 2 | 3;

export type Mood =
  | "light"
  | "fresh"
  | "hearty"
  | "comforting"
  | "indulgent"
  | "adventurous";

export type Occasion = "romantic" | "family" | "celebration" | "casual" | "solo";

/** 1 = $, 2 = $$, 3 = $$$. */
export type PriceTier = 1 | 2 | 3;

export interface Dish {
  id: string;
  name: string;
  description: string;
  /** Price in euros. */
  price: number;
  priceTier: PriceTier;
  category: Category;
  /** Optional remote image; the UI falls back to a generated visual when absent. */
  image?: string;
  dietaryTags: DietaryTag[];
  spiceLevel: SpiceLevel;
  moods: Mood[];
  occasions: Occasion[];
  ingredients: string[];
  /** Highlighted on the home page. */
  featured?: boolean;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  description: string;
}
