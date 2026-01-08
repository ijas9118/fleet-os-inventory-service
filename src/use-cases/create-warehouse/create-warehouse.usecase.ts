import type { IWareHouseRepository } from "@/domain/repositories/warehouse.repository.interface";

import { Warehouse } from "@/domain/entities";
import { WarehouseStatus } from "@/domain/enums";
import { WarehouseCodeAlreadyExistsError } from "@/domain/errors";

import type { CreateWarehouseDTO } from "./create-warehouse.dto";

export class CreateWarehouseUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
  ) {}

  async execute(dto: CreateWarehouseDTO): Promise<Warehouse> {
    const existing = await this._warehouseRepo.findByCode(dto.code.toUpperCase(), dto.tenantId);

    if (existing) {
      throw new WarehouseCodeAlreadyExistsError(dto.code);
    }

    const warehouse = new Warehouse({
      tenantId: dto.tenantId,
      name: dto.name,
      code: dto.code.toUpperCase(),
      address: dto.address,
      status: WarehouseStatus.ACTIVE,
    });

    const result = await this._warehouseRepo.createWarehouse(warehouse.propsSnapshot);

    return result;
  }
}
