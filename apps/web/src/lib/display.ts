import type { Category, DietaryTag, SpiceLevel } from "@olea/menu-data";

/** Formats a euro price without trailing zeros noise. */
export function formatPrice(price: number): string {
  return `€${price}`;
}

export const dietaryLabels: Record<DietaryTag, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  pescatarian: "Pescatarian",
  "gluten-free": "Gluten-free",
  "dairy-free": "Dairy-free",
  "nut-free": "Nut-free",
  "contains-meat": "Meat",
  "contains-seafood": "Seafood",
};

/** Dietary tags worth surfacing to guests as positive badges. */
export const positiveDietaryTags: DietaryTag[] = [
  "vegan",
  "vegetarian",
  "pescatarian",
  "gluten-free",
];

export function spiceLabel(level: SpiceLevel): string {
  return ["No heat", "Mild", "Medium", "Spicy"][level];
}

export const categoryLabels: Record<Category, string> = {
  starters: "Starters",
  mains: "Mains",
  seafood: "From the Sea",
  desserts: "Desserts",
  drinks: "Drinks",
};
