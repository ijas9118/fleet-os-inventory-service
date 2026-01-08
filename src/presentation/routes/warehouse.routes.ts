import { Router } from "express";

import { CreateWarehouseDTOSchema } from "@/use-cases/create-warehouse/create-warehouse.dto";
import { updateWarehouseStatusSchema } from "@/use-cases/update-warehouse-status/update-warehouse-status.schema";

import type { WarehouseController } from "../controllers/warehouse.controller";

import { requireAuth, validate } from "../middlewares";

export function buildWarehouseRoutes(controller: WarehouseController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", validate(CreateWarehouseDTOSchema), controller.createWarehouse);
  router.get("/", controller.listWarehouses);
  router.get("/:id", controller.getWarehouse);
  router.patch("/:id/status", validate(updateWarehouseStatusSchema), controller.updateWarehouseStatus);

  return router;
}
