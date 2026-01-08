import { Router } from "express";

import { CreateWarehouseDTOSchema } from "@/use-cases/create-warehouse/create-warehouse.dto";

import type { WarehouseController } from "../controllers/warehouse.controller";

import { requireAuth, validate } from "../middlewares";

export function buildWarehouseRoutes(controller: WarehouseController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", validate(CreateWarehouseDTOSchema), controller.createWarehouse);
  router.get("/", controller.listWarehouses);

  return router;
}
