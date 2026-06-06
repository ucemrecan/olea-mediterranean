import "dotenv/config";

/** Centralised, typed access to environment configuration with sane defaults. */
export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  databaseUrl: process.env.DATABASE_URL ?? "file:./data/olea.sqlite",
  gemini: {
    apiKey: process.env.GEMINI_API_KEY?.trim() || undefined,
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  },
} as const;

/** True when an LLM key is configured; otherwise the rule-based engine runs. */
export const isLlmEnabled = Boolean(env.gemini.apiKey);
