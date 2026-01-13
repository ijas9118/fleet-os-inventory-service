import { Router } from "express";

import type { ReservationController } from "../controllers/reservation.controller";

import { internalAuth } from "../middlewares";

export function buildReservationRoutes(controller: ReservationController): Router {
  const router = Router();

  // All reservation routes require internal API key authentication
  // These are service-to-service endpoints, not user-facing
  router.use(internalAuth);

  // Reserve stock
  router.post("/reserve", controller.reserveStock);

  // Release reservation
  router.post("/release", controller.releaseReservation);

  return router;
}
