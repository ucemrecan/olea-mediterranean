import type { RecommendationPreferences, RecommendationResult } from "@olea/menu-data";

/**
 * Client-side call to the assistant route handler. Uses a relative URL, so it
 * is same-origin in every environment (local and Vercel) — no CORS, no API
 * base URL. The Gemini key stays on the server.
 */
export async function requestRecommendation(
  preferences: RecommendationPreferences,
  options?: { message?: string; limit?: number },
): Promise<RecommendationResult> {
  const res = await fetch("/api/assistant/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      preferences,
      message: options?.message,
      limit: options?.limit ?? 3,
    }),
  });
  if (!res.ok) {
    throw new Error(`Recommendation request failed: ${res.status}`);
  }
  return res.json() as Promise<RecommendationResult>;
}
