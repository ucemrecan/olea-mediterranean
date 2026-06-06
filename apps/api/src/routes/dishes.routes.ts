import { Router } from "express";
import { getDishById, getDishes } from "../repositories/menu.repository";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const featured = req.query.featured === "true" ? true : undefined;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;
    res.json(await getDishes({ featured, category }));
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const dish = await getDishById(req.params.id);
    if (!dish) {
      res.status(404).json({ error: { message: "Dish not found" } });
      return;
    }
    res.json(dish);
  } catch (error) {
    next(error);
  }
});

export default router;
