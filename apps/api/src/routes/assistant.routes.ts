import { Router } from "express";
import { z } from "zod";
import type { RecommendationPreferences } from "@olea/menu-data";
import { recommend } from "../services/recommendation.service";

const router = Router();

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

router.post("/recommend", async (req, res, next) => {
  try {
    const parsed = bodySchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res
        .status(400)
        .json({ error: { message: "Invalid request", details: parsed.error.flatten() } });
      return;
    }

    const { preferences, message, limit } = parsed.data;
    const result = await recommend(
      preferences as RecommendationPreferences,
      message,
      limit ?? 3,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
