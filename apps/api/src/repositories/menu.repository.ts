import type { Category, CategoryInfo, Dish, SpiceLevel, PriceTier } from "@olea/menu-data";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { categories, dishes, type CategoryRow, type DishRow } from "../db/schema";

/** Maps a database row back into the shared `Dish` shape (parsing JSON cols). */
function toDish(row: DishRow): Dish {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    priceTier: row.priceTier as PriceTier,
    category: row.category as Category,
    image: row.image ?? undefined,
    spiceLevel: row.spiceLevel as SpiceLevel,
    featured: row.featured,
    dietaryTags: JSON.parse(row.dietaryTags),
    moods: JSON.parse(row.moods),
    occasions: JSON.parse(row.occasions),
    ingredients: JSON.parse(row.ingredients),
  };
}

function toCategory(row: CategoryRow): CategoryInfo {
  return { id: row.id as Category, label: row.label, description: row.description };
}

export async function getCategories(): Promise<CategoryInfo[]> {
  const rows = await db.select().from(categories);
  return rows.map(toCategory);
}

export async function getDishes(filter?: {
  category?: string;
  featured?: boolean;
}): Promise<Dish[]> {
  const rows = await db.select().from(dishes);
  let result = rows.map(toDish);
  if (filter?.category) {
    result = result.filter((dish) => dish.category === filter.category);
  }
  if (filter?.featured) {
    result = result.filter((dish) => dish.featured);
  }
  return result;
}

export async function getDishById(id: string): Promise<Dish | null> {
  const rows = await db.select().from(dishes).where(eq(dishes.id, id)).limit(1);
  return rows[0] ? toDish(rows[0]) : null;
}
