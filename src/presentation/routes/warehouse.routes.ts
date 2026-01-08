import { Router } from "express";

import { CreateWarehouseDTOSchema } from "@/use-cases/create-warehouse/create-warehouse.dto";
import { updateWarehouseStatusSchema } from "@/use-cases/update-warehouse-status/update-warehouse-status.schema";
import { updateWarehouseSchema } from "@/use-cases/update-warehouse/update-warehouse.schema";

import type { WarehouseController } from "../controllers/warehouse.controller";

import { requireAuth, validate } from "../middlewares";

export function buildWarehouseRoutes(controller: WarehouseController): Router {
  const router = Router();

  router.use(requireAuth);

  router.post("/", validate(CreateWarehouseDTOSchema), controller.createWarehouse);
  router.get("/", controller.listWarehouses);
  router.get("/:id", controller.getWarehouse);
  router.put("/:id", validate(updateWarehouseSchema), controller.updateWarehouse);
  router.patch("/:id/status", validate(updateWarehouseStatusSchema), controller.updateWarehouseStatus);
  router.delete("/:id", controller.archiveWarehouse);

  return router;
}
