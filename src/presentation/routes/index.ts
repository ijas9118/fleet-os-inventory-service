import { Router } from "express";

import type { buildContainer } from "@/di/container";

import { buildWarehouseRoutes } from "./warehouse.routes";

export function buildRoutes(controllers: ReturnType<typeof buildContainer>) {
  const router = Router();

  router.use("/warehouses", buildWarehouseRoutes(controllers.warehouseController));

  return router;
}
