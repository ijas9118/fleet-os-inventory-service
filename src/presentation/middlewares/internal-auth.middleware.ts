import type { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@ahammedijas/fleet-os-shared";

import env from "@/config/validate-env";
import { HttpError } from "@/utils/http-error-class";

/**
 * Middleware to verify internal API key for inter-service communication
 * This protects internal endpoints from unauthorized access
 */
export function internalAuth(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-internal-api-key"];

  const validApiKey = env.INTERNAL_API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    throw new HttpError("Unauthorized: Invalid Internal API Key", STATUS_CODES.UNAUTHORIZED);
  }

  next();
}
