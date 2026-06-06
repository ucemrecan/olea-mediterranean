import { categories, dishes, type CategoryInfo, type Dish } from "@olea/menu-data";

/**
 * Menu accessors backed by the shared static data. Called from Server
 * Components, so the menu is read in-process — no database, no network. If a
 * real CMS/API is ever added, only this file changes.
 */

export async function getCategories(): Promise<CategoryInfo[]> {
  return categories;
}

export async function getMenu(): Promise<Dish[]> {
  return dishes;
}

export async function getDish(id: string): Promise<Dish | null> {
  return dishes.find((dish) => dish.id === id) ?? null;
}

export async function getFeatured(): Promise<Dish[]> {
  return dishes.filter((dish) => dish.featured);
}
