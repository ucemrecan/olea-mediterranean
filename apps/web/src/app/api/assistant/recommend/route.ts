import { NextResponse } from "next/server";
import { z } from "zod";
import type { RecommendationPreferences } from "@olea/menu-data";
import { recommend } from "@/lib/server/recommendation";

// Gemini SDK needs the Node.js runtime; this route is always dynamic.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const preferencesSchema = z.object({
  diet: z.enum(["vegan", "vegetarian", "pescatarian", "no-restriction"]).optional(),
  spice: z.enum(["mild", "medium", "spicy", "any"]).optional(),
  mood: z
    .enum(["light", "fresh", "hearty", "comforting", "indulgent", "adventurous"])
    .optional(),
  occasion: z.enum(["romantic", "family", "celebration", "casual", "solo"]).optional(),
  course: z
    .union([
      z.enum(["starters", "mains", "seafood", "desserts", "drinks"]),
      z.literal("any"),
    ])
    .optional(),
  budget: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal("any")]).optional(),
});

const bodySchema = z.object({
  preferences: preferencesSchema.default({}),
  message: z.string().trim().max(500).optional(),
  limit: z.number().int().min(1).max(6).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { message: "Invalid request", details: parsed.error.flatten() } },
      { status: 400 },
    );
  }

  const { preferences, message, limit } = parsed.data;
  const result = await recommend(
    preferences as RecommendationPreferences,
    message,
    limit ?? 3,
  );
  return NextResponse.json(result);
}
