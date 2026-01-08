import { UserRole } from "@ahammedijas/fleet-os-shared";
import { Router } from "express";

import { CreateInventoryItemDTOSchema } from "@/use-cases/inventory-item/create-inventory-item";
import { UpdateInventoryItemDTOSchema } from "@/use-cases/inventory-item/update-inventory-item";

import type { InventoryItemController } from "../controllers/inventory-item.controller";

import { requireAuth, requireRole, validate } from "../middlewares";

export function buildInventoryItemRoutes(controller: InventoryItemController): Router {
  const router = Router();

  // All routes require authentication
  router.use(requireAuth);

  // List inventory items
  router.get(
    "/",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,
      UserRole.WAREHOUSE_MANAGER,
    ]),
    controller.listInventoryItems,
  );

  // Create inventory item
  router.post(
    "/",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    validate(CreateInventoryItemDTOSchema),
    controller.createInventoryItem,
  );

  // Get single inventory item
  router.get(
    "/:id",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,
      UserRole.WAREHOUSE_MANAGER,
    ]),
    controller.getInventoryItem,
  );

  // Update inventory item
  router.put(
    "/:id",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    validate(UpdateInventoryItemDTOSchema),
    controller.updateInventoryItem,
  );

  // Update status
  router.patch(
    "/:id/status",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    controller.updateStatus,
  );

  // Archive inventory item
  router.delete(
    "/:id",
    requireRole([UserRole.TENANT_ADMIN]),
    controller.archiveInventoryItem,
  );

  return router;
}
