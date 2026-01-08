import type { IWareHouseRepository } from "@/domain/repositories/warehouse.repository.interface";

import { WarehouseArchivedError, WarehouseNotFoundError } from "@/domain/errors";

import type { UpdateWarehouseStatusDTO } from "./update-warehouse-status.dto";

export class UpdateWarehouseStatusUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
  ) {}

  async execute(dto: UpdateWarehouseStatusDTO): Promise<void> {
    // Find warehouse and verify tenant ownership
    const warehouse = await this._warehouseRepo.findById(dto.warehouseId, dto.tenantId);

    if (!warehouse) {
      throw new WarehouseNotFoundError(dto.warehouseId);
    }

    // Prevent status changes on archived warehouses
    if (warehouse.status === "ARCHIVED") {
      throw new WarehouseArchivedError(dto.warehouseId);
    }

    // Update status
    warehouse.updateStatus(dto.status as any);

    // Save only status and updatedAt to repository (avoid address transformation issues)
    await this._warehouseRepo.updateWarehouse(dto.warehouseId, {
      status: warehouse.status,
      updatedAt: warehouse.updatedAt,
    });
  }
}
