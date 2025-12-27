import { Router } from "express";

import type { WarehouseController } from "../controllers/warehouse.controller";

import { requireAuth } from "../middlewares";

export function buildWarehouseRoutes(controller: WarehouseController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", controller.createWarehouse);
  router.get("/", controller.listWarehouses);

  return router;
}
