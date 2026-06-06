import {
  categories,
  dishes,
  recommendDishes,
  type CategoryInfo,
  type Dish,
  type RecommendationPreferences,
  type ScoredDish,
} from "@olea/menu-data";

/**
 * The single seam between the UI and its data source.
 *
 * Today a mock implementation serves the bundled menu. When the REST API lands,
 * an `HttpMenuClient` implements the same interface and `getMenuClient()` picks
 * it based on `NEXT_PUBLIC_DATA_SOURCE` — no page or component has to change.
 */
export interface MenuClient {
  getCategories(): Promise<CategoryInfo[]>;
  getMenu(): Promise<Dish[]>;
  getDish(id: string): Promise<Dish | null>;
  getFeatured(): Promise<Dish[]>;
  recommend(prefs: RecommendationPreferences, limit?: number): Promise<ScoredDish[]>;
}

class MockMenuClient implements MenuClient {
  async getCategories(): Promise<CategoryInfo[]> {
    return categories;
  }

  async getMenu(): Promise<Dish[]> {
    return dishes;
  }

  async getDish(id: string): Promise<Dish | null> {
    return dishes.find((dish) => dish.id === id) ?? null;
  }

  async getFeatured(): Promise<Dish[]> {
    return dishes.filter((dish) => dish.featured);
  }

  async recommend(
    prefs: RecommendationPreferences,
    limit = 3,
  ): Promise<ScoredDish[]> {
    return recommendDishes(prefs, dishes, limit);
  }
}

let client: MenuClient | null = null;

export function getMenuClient(): MenuClient {
  if (!client) {
    // Future: switch on process.env.NEXT_PUBLIC_DATA_SOURCE === "api".
    client = new MockMenuClient();
  }
  return client;
}
