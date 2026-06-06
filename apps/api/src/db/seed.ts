import { categories as categoryData, dishes as dishData } from "@olea/menu-data";
import { db, ensureSchema } from "./client";
import { categories, dishes } from "./schema";

/**
 * Seeds the database from the shared menu-data package. Idempotent: if dishes
 * already exist, it does nothing. This keeps the API's data identical to the
 * mock the frontend was built against.
 */
export async function seed(): Promise<{ seeded: boolean; count: number }> {
  await ensureSchema();

  const existing = await db.select({ id: dishes.id }).from(dishes).limit(1);
  if (existing.length > 0) {
    return { seeded: false, count: 0 };
  }

  await db.insert(categories).values(
    categoryData.map((category) => ({
      id: category.id,
      label: category.label,
      description: category.description,
    })),
  );

  await db.insert(dishes).values(
    dishData.map((dish) => ({
      id: dish.id,
      name: dish.name,
      description: dish.description,
      price: dish.price,
      priceTier: dish.priceTier,
      category: dish.category,
      image: dish.image ?? null,
      spiceLevel: dish.spiceLevel,
      featured: dish.featured ?? false,
      dietaryTags: JSON.stringify(dish.dietaryTags),
      moods: JSON.stringify(dish.moods),
      occasions: JSON.stringify(dish.occasions),
      ingredients: JSON.stringify(dish.ingredients),
    })),
  );

  return { seeded: true, count: dishData.length };
}

// Allow running as a standalone script: `pnpm --filter @olea/api seed`.
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop() ?? "")) {
  seed()
    .then((result) => {
      console.log(
        result.seeded ? `Seeded ${result.count} dishes.` : "Already seeded — skipped.",
      );
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}
