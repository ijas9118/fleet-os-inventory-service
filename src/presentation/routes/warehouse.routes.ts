import { Router } from "express";

import type { WarehouseController } from "../controllers/warehouse.controller";

export function buildWarehouseRoutes(controller: WarehouseController): Router {
  const router = Router();

  router.post("/", controller.createWarehouse);

  return router;
}
