import cors from "cors";
import express from "express";
import morgan from "morgan";
import { ensureSchema } from "./db/client";
import { seed } from "./db/seed";
import { env, isLlmEnabled } from "./env";
import { errorHandler } from "./middleware/error";
import assistantRoutes from "./routes/assistant.routes";
import categoriesRoutes from "./routes/categories.routes";
import dishesRoutes from "./routes/dishes.routes";

async function main() {
  // Prepare the database before accepting traffic.
  await ensureSchema();
  const result = await seed();
  console.log(
    result.seeded
      ? `Database seeded with ${result.count} dishes.`
      : "Database already seeded.",
  );

  const app = express();
  // Log every incoming request (method, path, status, timing) to stdout.
  app.use(morgan("dev"));
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, llm: isLlmEnabled ? "enabled" : "rule-based" });
  });

  app.use("/api/categories", categoriesRoutes);
  app.use("/api/dishes", dishesRoutes);
  app.use("/api/assistant", assistantRoutes);

  app.use(errorHandler);

  app.listen(env.port, () => {
    console.log(`Olea API listening on http://localhost:${env.port}`);
    console.log(`Assistant mode: ${isLlmEnabled ? "Gemini LLM" : "rule-based"}`);
  });
}

main().catch((error) => {
  console.error("Failed to start API:", error);
  process.exit(1);
});
