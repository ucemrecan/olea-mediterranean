import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { env } from "../env";
import * as schema from "./schema";

// libsql will create the database file, but not its parent directory.
if (env.databaseUrl.startsWith("file:")) {
  const filePath = env.databaseUrl.slice("file:".length);
  mkdirSync(dirname(filePath), { recursive: true });
}

export const libsql = createClient({ url: env.databaseUrl });

export const db = drizzle(libsql, { schema });

/** Creates tables if they do not exist yet. Safe to call on every boot. */
export async function ensureSchema(): Promise<void> {
  await libsql.executeMultiple(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      label TEXT NOT NULL,
      description TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS dishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      price_tier INTEGER NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      spice_level INTEGER NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      dietary_tags TEXT NOT NULL,
      moods TEXT NOT NULL,
      occasions TEXT NOT NULL,
      ingredients TEXT NOT NULL
    );
  `);
}
