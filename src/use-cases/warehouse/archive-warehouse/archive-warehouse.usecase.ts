import type { IWareHouseRepository } from "@/domain/repositories/warehouse.repository.interface";

import { WarehouseNotFoundError } from "@/domain/errors";

import type { ArchiveWarehouseDTO } from "./archive-warehouse.dto";

export class ArchiveWarehouseUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
  ) {}

  async execute(dto: ArchiveWarehouseDTO): Promise<void> {
    // Find warehouse and verify tenant ownership
    const warehouse = await this._warehouseRepo.findById(dto.warehouseId, dto.tenantId);

    if (!warehouse) {
      throw new WarehouseNotFoundError(dto.warehouseId);
    }

    // Archive the warehouse (soft delete)
    warehouse.archive();

    // Save the archived warehouse
    await this._warehouseRepo.updateWarehouse(dto.warehouseId, {
      status: warehouse.status,
      deletedAt: warehouse.deletedAt,
      updatedAt: warehouse.updatedAt,
    });
  }
}
