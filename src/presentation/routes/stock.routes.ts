import { UserRole } from "@ahammedijas/fleet-os-shared";
import { Router } from "express";

import type { StockController } from "../controllers/stock.controller";

import { requireAuth, requireRole } from "../middlewares";

export function buildStockRoutes(controller: StockController): Router {
  const router = Router();

  // All routes require authentication
  router.use(requireAuth);

  // List stock records
  router.get(
    "/",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,

    ]),
    controller.listStock,
  );

  // Create stock record
  router.post(
    "/",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    controller.createStockRecord,
  );

  // Get warehouse stock
  router.get(
    "/warehouse/:warehouseId",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,

    ]),
    controller.getWarehouseStock,
  );

  // Get single stock record
  router.get(
    "/:id",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,

    ]),
    controller.getStock,
  );

  // Add stock (IN transaction)
  router.post(
    "/add",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,

    ]),
    controller.addStock,
  );

  // Remove stock (OUT transaction)
  router.post(
    "/remove",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,

    ]),
    controller.removeStock,
  );

  // Adjust stock (ADJUSTMENT transaction)
  router.post(
    "/adjust",
    requireRole([UserRole.TENANT_ADMIN, UserRole.OPERATIONS_MANAGER]),
    controller.adjustStock,
  );

  // Transfer stock between warehouses
  router.post(
    "/transfer",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,

    ]),
    controller.transferStock,
  );

  return router;
}
