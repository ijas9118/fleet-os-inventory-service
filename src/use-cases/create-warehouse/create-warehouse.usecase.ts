import type { IWareHouseRepository } from "@/domain/repositories/warehouse.repository.interface";
import type { ICacheRepository } from "@/infrastructure/cache/cache.repository";

import { Warehouse } from "@/domain/entities";
import { WarehouseStatus } from "@/domain/enums";
import { WarehouseCodeAlreadyExistsError } from "@/domain/errors";

import type { CreateWarehouseDTO } from "./create-warehouse.dto";

export class CreateWarehouseUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
    private _cache?: ICacheRepository,
  ) {}

  private _makeKey(tenantId: string): string {
    return `warehouses:${tenantId}`;
  }

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

    if (this._cache)
      await this._cache.delete(this._makeKey(dto.tenantId));

    return result;
  }
}
