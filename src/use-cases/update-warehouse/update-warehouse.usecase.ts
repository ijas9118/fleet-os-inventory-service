import type { IWareHouseRepository } from "@/domain/repositories/warehouse.repository.interface";

import { WarehouseArchivedError, WarehouseNotFoundError } from "@/domain/errors";

import type { UpdateWarehouseDTO } from "./update-warehouse.dto";

export class UpdateWarehouseUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
  ) {}

  async execute(dto: UpdateWarehouseDTO): Promise<void> {
    // Find warehouse and verify tenant ownership
    const warehouse = await this._warehouseRepo.findById(dto.warehouseId, dto.tenantId);

    if (!warehouse) {
      throw new WarehouseNotFoundError(dto.warehouseId);
    }

    // Prevent editing archived warehouses
    if (warehouse.status === "ARCHIVED") {
      throw new WarehouseArchivedError(dto.warehouseId);
    }

    // Update warehouse properties
    await this._warehouseRepo.updateWarehouse(dto.warehouseId, {
      name: dto.name,
      code: dto.code,
      address: dto.address,
      updatedAt: new Date(),
    });
  }
}
