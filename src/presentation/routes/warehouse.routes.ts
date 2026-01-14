import { Router } from "express";

import { CreateWarehouseDTOSchema } from "@/use-cases/warehouse/create-warehouse";
import { updateWarehouseSchema } from "@/use-cases/warehouse/update-warehouse";
import { updateWarehouseStatusSchema } from "@/use-cases/warehouse/update-warehouse-status";

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
