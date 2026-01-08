import { InventoryItemRepository } from "@/infrastructure/repositories/inventory-item.repository";
import { WarehouseRepository } from "@/infrastructure/repositories/warehouse.repository";
import { InventoryItemController } from "@/presentation/controllers/inventory-item.controller";
import { WarehouseController } from "@/presentation/controllers/warehouse.controller";
import { ArchiveInventoryItemUseCase } from "@/use-cases/inventory-item/archive-inventory-item/archive-inventory-item.usecase";
import { CreateInventoryItemUseCase } from "@/use-cases/inventory-item/create-inventory-item/create-inventory-item.usecase";
import { GetInventoryItemUseCase } from "@/use-cases/inventory-item/get-inventory-item/get-inventory-item.usecase";
import { ListInventoryItemsUseCase } from "@/use-cases/inventory-item/list-inventory-items/list-inventory-items.usecase";
import { UpdateInventoryItemStatusUseCase } from "@/use-cases/inventory-item/update-inventory-item-status/update-inventory-item-status.usecase";
import { UpdateInventoryItemUseCase } from "@/use-cases/inventory-item/update-inventory-item/update-inventory-item.usecase";
import { ArchiveWarehouseUseCase } from "@/use-cases/warehouse/archive-warehouse/archive-warehouse.usecase";
import { CreateWarehouseUseCase } from "@/use-cases/warehouse/create-warehouse/create-warehouse.usecase";
import { GetWarehouseUseCase } from "@/use-cases/warehouse/get-warehouse/get-warehouse.usecase";
import { ListWarehousesUseCase } from "@/use-cases/warehouse/list-warehouses/list-warehouses.usecase";
import { UpdateWarehouseStatusUseCase } from "@/use-cases/warehouse/update-warehouse-status/update-warehouse-status.usecase";
import { UpdateWarehouseUseCase } from "@/use-cases/warehouse/update-warehouse/update-warehouse.usecase";

export function buildContainer() {
  // --- Repositories ---
  const warehouseRepo = new WarehouseRepository();
  const inventoryItemRepo = new InventoryItemRepository();

  // --- Use Cases ---
  // Warehouse
  const createWarehouseUC = new CreateWarehouseUseCase(warehouseRepo);
  const listWarehousesUC = new ListWarehousesUseCase(warehouseRepo);
  const getWarehouseUC = new GetWarehouseUseCase(warehouseRepo);
  const updateWarehouseUC = new UpdateWarehouseUseCase(warehouseRepo);
  const updateWarehouseStatusUC = new UpdateWarehouseStatusUseCase(warehouseRepo);
  const archiveWarehouseUC = new ArchiveWarehouseUseCase(warehouseRepo);

  // Inventory Item
  const createInventoryItemUC = new CreateInventoryItemUseCase(inventoryItemRepo);
  const listInventoryItemsUC = new ListInventoryItemsUseCase(inventoryItemRepo);
  const getInventoryItemUC = new GetInventoryItemUseCase(inventoryItemRepo);
  const updateInventoryItemUC = new UpdateInventoryItemUseCase(inventoryItemRepo);
  const updateInventoryItemStatusUC = new UpdateInventoryItemStatusUseCase(inventoryItemRepo);
  const archiveInventoryItemUC = new ArchiveInventoryItemUseCase(inventoryItemRepo);

  // --- Controllers ---
  const warehouseController = new WarehouseController(
    createWarehouseUC,
    listWarehousesUC,
    getWarehouseUC,
    updateWarehouseUC,
    updateWarehouseStatusUC,
    archiveWarehouseUC,
  );

  const inventoryItemController = new InventoryItemController(
    createInventoryItemUC,
    listInventoryItemsUC,
    getInventoryItemUC,
    updateInventoryItemUC,
    updateInventoryItemStatusUC,
    archiveInventoryItemUC,
  );

  return {
    warehouseController,
    inventoryItemController,
  };
}
