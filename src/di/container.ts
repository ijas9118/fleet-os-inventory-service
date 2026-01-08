import { WarehouseRepository } from "@/infrastructure/repositories/warehouse.repository";
import { WarehouseController } from "@/presentation/controllers/warehouse.controller";
import { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";
import { ListWarehousesUseCase } from "@/use-cases/list-warehouses/list-warehouses.usecase";

export function buildContainer() {
  // --- Repositories ---
  const warehouseRepo = new WarehouseRepository();

  // --- Use Cases ---
  const createWarehouseUC = new CreateWarehouseUseCase(warehouseRepo);
  const listWarehousesUC = new ListWarehousesUseCase(warehouseRepo);

  // --- Controllers ---
  const warehouseController = new WarehouseController(
    createWarehouseUC,
    listWarehousesUC,
  );

  return {
    warehouseController,
  };
}
