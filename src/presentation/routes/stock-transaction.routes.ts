import { UserRole } from "@ahammedijas/fleet-os-shared";
import { Router } from "express";

import type { StockTransactionController } from "../controllers/stock-transaction.controller";

import { requireAuth, requireRole } from "../middlewares";

export function buildStockTransactionRoutes(controller: StockTransactionController): Router {
  const router = Router();

  // All routes require authentication
  router.use(requireAuth);

  // List stock transactions
  router.get(
    "/",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,
      UserRole.WAREHOUSE_MANAGER,
    ]),
    controller.listStockTransactions,
  );

  // Get single stock transaction
  router.get(
    "/:id",
    requireRole([
      UserRole.TENANT_ADMIN,
      UserRole.OPERATIONS_MANAGER,
      UserRole.WAREHOUSE_MANAGER,
    ]),
    controller.getStockTransaction,
  );

  return router;
}
