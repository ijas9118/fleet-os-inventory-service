import { RedisCacheRepository } from "@/infrastructure/cache/redis.cache.repository";
import { WarehouseRepository } from "@/infrastructure/repositories/warehouse.repository";
import { WarehouseController } from "@/presentation/controllers/warehouse.controller";
import { CreateWarehouseUseCase } from "@/use-cases/create-warehouse/create-warehouse.usecase";
import { ListWarehousesUseCase } from "@/use-cases/list-warehouses/list-warehouses.usecase";

export function buildContainer() {
  // --- Repositories ---
  const warehouseRepo = new WarehouseRepository();
  const redisCacheRepo = new RedisCacheRepository();

  // --- Use Cases ---
  const createWarehouseUC = new CreateWarehouseUseCase(warehouseRepo, redisCacheRepo);
  const listWarehousesUC = new ListWarehousesUseCase(warehouseRepo, redisCacheRepo);

  // --- Controllers ---
  const warehouseController = new WarehouseController(
    createWarehouseUC,
    listWarehousesUC,
  );

  return {
    warehouseController,
  };
}
