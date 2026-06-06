import { Router } from "express";
import { getCategories } from "../repositories/menu.repository";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await getCategories());
  } catch (error) {
    next(error);
  }
});

export default router;
