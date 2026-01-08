import type { IWareHouseRepository } from "@/domain/repositories/warehouse.repository.interface";

import { WarehouseNotFoundError } from "@/domain/errors";

import type { GetWarehouseDTO } from "./get-warehouse.dto";

export class GetWarehouseUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
  ) {}

  async execute(dto: GetWarehouseDTO) {
    const warehouse = await this._warehouseRepo.findById(dto.warehouseId, dto.tenantId);

    if (!warehouse) {
      throw new WarehouseNotFoundError(dto.warehouseId);
    }

    return {
      id: warehouse.id,
      tenantId: warehouse.tenantId,
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      status: warehouse.status,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
    };
  }
}
