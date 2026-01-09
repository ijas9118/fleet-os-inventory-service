import { InventoryItemRepository } from "@/infrastructure/repositories/inventory-item.repository";
import { StockTransactionRepository } from "@/infrastructure/repositories/stock-transaction.repository";
import { StockRepository } from "@/infrastructure/repositories/stock.repository";
import { WarehouseRepository } from "@/infrastructure/repositories/warehouse.repository";
import { InventoryItemController } from "@/presentation/controllers/inventory-item.controller";
import { StockTransactionController } from "@/presentation/controllers/stock-transaction.controller";
import { StockController } from "@/presentation/controllers/stock.controller";
import { WarehouseController } from "@/presentation/controllers/warehouse.controller";
import { ArchiveInventoryItemUseCase } from "@/use-cases/inventory-item/archive-inventory-item/archive-inventory-item.usecase";
import { CreateInventoryItemUseCase } from "@/use-cases/inventory-item/create-inventory-item/create-inventory-item.usecase";
import { GetInventoryItemUseCase } from "@/use-cases/inventory-item/get-inventory-item/get-inventory-item.usecase";
import { ListInventoryItemsUseCase } from "@/use-cases/inventory-item/list-inventory-items/list-inventory-items.usecase";
import { UpdateInventoryItemStatusUseCase } from "@/use-cases/inventory-item/update-inventory-item-status/update-inventory-item-status.usecase";
import { UpdateInventoryItemUseCase } from "@/use-cases/inventory-item/update-inventory-item/update-inventory-item.usecase";
import { GetStockTransactionUseCase } from "@/use-cases/stock-transaction/get-stock-transaction/get-stock-transaction.usecase";
import { ListStockTransactionsUseCase } from "@/use-cases/stock-transaction/list-stock-transactions/list-stock-transactions.usecase";
import { AddStockUseCase } from "@/use-cases/stock/add-stock/add-stock.usecase";
import { AdjustStockUseCase } from "@/use-cases/stock/adjust-stock/adjust-stock.usecase";
import { CreateStockRecordUseCase } from "@/use-cases/stock/create-stock-record/create-stock-record.usecase";
import { GetStockUseCase } from "@/use-cases/stock/get-stock/get-stock.usecase";
import { GetWarehouseStockUseCase } from "@/use-cases/stock/get-warehouse-stock/get-warehouse-stock.usecase";
import { ListStockUseCase } from "@/use-cases/stock/list-stock/list-stock.usecase";
import { RemoveStockUseCase } from "@/use-cases/stock/remove-stock/remove-stock.usecase";
import { TransferStockUseCase } from "@/use-cases/stock/transfer-stock/transfer-stock.usecase";
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
  const stockRepo = new StockRepository();
  const stockTransactionRepo = new StockTransactionRepository();

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

  // Stock
  const createStockRecordUC = new CreateStockRecordUseCase(stockRepo);
  const listStockUC = new ListStockUseCase(stockRepo);
  const getStockUC = new GetStockUseCase(stockRepo);
  const getWarehouseStockUC = new GetWarehouseStockUseCase(stockRepo);
  const addStockUC = new AddStockUseCase(stockRepo, stockTransactionRepo);
  const removeStockUC = new RemoveStockUseCase(stockRepo, stockTransactionRepo);
  const adjustStockUC = new AdjustStockUseCase(stockRepo, stockTransactionRepo);
  const transferStockUC = new TransferStockUseCase(stockRepo, stockTransactionRepo);

  // Stock Transactions
  const listStockTransactionsUC = new ListStockTransactionsUseCase(stockTransactionRepo);
  const getStockTransactionUC = new GetStockTransactionUseCase(stockTransactionRepo);

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

  const stockController = new StockController(
    createStockRecordUC,
    listStockUC,
    getStockUC,
    getWarehouseStockUC,
    addStockUC,
    removeStockUC,
    adjustStockUC,
    transferStockUC,
  );

  const stockTransactionController = new StockTransactionController(
    listStockTransactionsUC,
    getStockTransactionUC,
  );

  return {
    warehouseController,
    inventoryItemController,
    stockController,
    stockTransactionController,
  };
}
