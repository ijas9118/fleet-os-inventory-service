import { WarehouseRepository } from "@/infrastructure/repositories/warehouse.repository";
import { WarehouseController } from "@/presentation/controllers/warehouse.controller";
import { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";

export function buildContainer() {
  // --- Repositories ---
  const warehouseRepo = new WarehouseRepository();

  // --- Use Cases ---
  const createWarehouseUC = new CreateWarehouseUseCase(warehouseRepo);

  // --- Controllers ---
  const warehouseController = new WarehouseController(
    createWarehouseUC,
  );

  return {
    warehouseController,
  };
}
