import { WarehouseRepository } from "@/infrastructure/repositories/warehouse.repository";
import { WarehouseController } from "@/presentation/controllers/warehouse.controller";
import { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";
import { GetWarehouseUseCase } from "@/use-cases/get-warehouse/get-warehouse.usecase";
import { ListWarehousesUseCase } from "@/use-cases/list-warehouses/list-warehouses.usecase";
import { UpdateWarehouseStatusUseCase } from "@/use-cases/update-warehouse-status/update-warehouse-status.usecase";

export function buildContainer() {
  // --- Repositories ---
  const warehouseRepo = new WarehouseRepository();

  // --- Use Cases ---
  const createWarehouseUC = new CreateWarehouseUseCase(warehouseRepo);
  const listWarehousesUC = new ListWarehousesUseCase(warehouseRepo);
  const getWarehouseUC = new GetWarehouseUseCase(warehouseRepo);
  const updateWarehouseStatusUC = new UpdateWarehouseStatusUseCase(warehouseRepo);

  // --- Controllers ---
  const warehouseController = new WarehouseController(
    createWarehouseUC,
    listWarehousesUC,
    getWarehouseUC,
    updateWarehouseStatusUC,
  );

  return {
    warehouseController,
  };
}
