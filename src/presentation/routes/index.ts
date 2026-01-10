import { Router } from "express";

import type { buildContainer } from "@/di/container";

import { buildInventoryItemRoutes } from "./inventory-item.routes";
import { buildStockTransactionRoutes } from "./stock-transaction.routes";
import { buildStockRoutes } from "./stock.routes";
import { buildWarehouseRoutes } from "./warehouse.routes";

export function buildRoutes(controllers: ReturnType<typeof buildContainer>) {
  const router = Router();

  router.use("/warehouses", buildWarehouseRoutes(controllers.warehouseController));
  router.use("/inventory-items", buildInventoryItemRoutes(controllers.inventoryItemController));
  router.use("/stocks", buildStockRoutes(controllers.stockController));
  router.use("/stock-transactions", buildStockTransactionRoutes(controllers.stockTransactionController));

  return router;
}
