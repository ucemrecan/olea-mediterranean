import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

/** Menu categories (Starters, Mains, …). */
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  description: text("description").notNull(),
});

/**
 * Dishes. List-valued fields (dietaryTags, moods, occasions, ingredients) are
 * stored as JSON-encoded text and parsed back into arrays by the repository.
 */
export const dishes = sqliteTable("dishes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: real("price").notNull(),
  priceTier: integer("price_tier").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  spiceLevel: integer("spice_level").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  dietaryTags: text("dietary_tags").notNull(),
  moods: text("moods").notNull(),
  occasions: text("occasions").notNull(),
  ingredients: text("ingredients").notNull(),
});

export type DishRow = typeof dishes.$inferSelect;
export type CategoryRow = typeof categories.$inferSelect;
