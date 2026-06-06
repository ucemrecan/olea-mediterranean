import type { NextFunction, Request, Response } from "express";

/** Central error handler: logs and returns a consistent JSON error envelope. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express needs the 4-arg signature.
  _next: NextFunction,
): void {
  console.error("Unhandled error:", err);
  const message = err instanceof Error ? err.message : "Internal server error";
  res.status(500).json({ error: { message } });
}
