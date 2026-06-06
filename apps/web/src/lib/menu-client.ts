import {
  categories,
  dishes,
  recommendDishes,
  type CategoryInfo,
  type Dish,
  type RecommendationPreferences,
  type RecommendationResult,
} from "@olea/menu-data";

/**
 * The single seam between the UI and its data source.
 *
 * `HttpMenuClient` talks to the REST API; `MockMenuClient` serves the bundled
 * menu. `getMenuClient()` picks one via `NEXT_PUBLIC_DATA_SOURCE` — no page or
 * component changes when switching.
 */
export interface MenuClient {
  getCategories(): Promise<CategoryInfo[]>;
  getMenu(): Promise<Dish[]>;
  getDish(id: string): Promise<Dish | null>;
  getFeatured(): Promise<Dish[]>;
  recommend(
    prefs: RecommendationPreferences,
    options?: { message?: string; limit?: number },
  ): Promise<RecommendationResult>;
}

/**
 * Resolves the API base URL. On the server (SSR inside Docker) we reach the API
 * by its service hostname; in the browser we use the public URL.
 */
function apiBase(): string {
  if (typeof window === "undefined") {
    return (
      process.env.API_URL_INTERNAL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:4000"
    );
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}

class HttpMenuClient implements MenuClient {
  private async get<T>(path: string): Promise<T> {
    const res = await fetch(`${apiBase()}${path}`);
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${path}`);
    }
    return res.json() as Promise<T>;
  }

  getCategories(): Promise<CategoryInfo[]> {
    return this.get<CategoryInfo[]>("/api/categories");
  }

  getMenu(): Promise<Dish[]> {
    return this.get<Dish[]>("/api/dishes");
  }

  async getDish(id: string): Promise<Dish | null> {
    const res = await fetch(`${apiBase()}/api/dishes/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API request failed: ${res.status}`);
    return res.json() as Promise<Dish>;
  }

  getFeatured(): Promise<Dish[]> {
    return this.get<Dish[]>("/api/dishes?featured=true");
  }

  async recommend(
    prefs: RecommendationPreferences,
    options?: { message?: string; limit?: number },
  ): Promise<RecommendationResult> {
    const res = await fetch(`${apiBase()}/api/assistant/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: prefs,
        message: options?.message,
        limit: options?.limit ?? 3,
      }),
    });
    if (!res.ok) throw new Error(`API request failed: ${res.status}`);
    return res.json() as Promise<RecommendationResult>;
  }
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
    options?: { message?: string; limit?: number },
  ): Promise<RecommendationResult> {
    const recommendations = recommendDishes(prefs, dishes, options?.limit ?? 3);
    const top = recommendations[0]?.dish.name;
    const reply = top
      ? `Based on your taste, here ${
          recommendations.length === 1 ? "is a dish" : `are ${recommendations.length} dishes`
        } I think you'll love — starting with the ${top}.`
      : "I couldn't find a match for that — try loosening one preference.";
    return { recommendations, reply, source: "rules" };
  }
}

let client: MenuClient | null = null;

export function getMenuClient(): MenuClient {
  if (!client) {
    client =
      process.env.NEXT_PUBLIC_DATA_SOURCE === "mock"
        ? new MockMenuClient()
        : new HttpMenuClient();
  }
  return client;
}
