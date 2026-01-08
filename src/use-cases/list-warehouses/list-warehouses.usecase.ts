import type { IWareHouseRepository } from "@/domain/repositories";
import type { ICacheRepository } from "@/infrastructure/cache/cache.repository";

import type { ListWarehousesDTO } from "./list-warehouses.dto";

const TTL_SECONDS = 3600;

export class ListWarehousesUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
    private _cache?: ICacheRepository,
  ) {}

  private _makeKey(tenantId: string): string {
    return `warehouses:${tenantId}`;
  }

  async execute(tenantId: string): Promise<ListWarehousesDTO[]> {
    const cacheKey = this._makeKey(tenantId);

    if (this._cache) {
      const cached = await this._cache.get<ListWarehousesDTO[]>(cacheKey);
      if (cached)
        return cached;
    }

    const warehouses = await this._warehouseRepo.listWarehouses(tenantId);

    const result = warehouses.map(w => ({
      id: w.id!,
      code: w.code,
      name: w.name,
      address: w.address,
      status: w.status,
      createdAt: w.createdAt,
      updatedAt: w.updatedAt,
    }));

    if (this._cache)
      await this._cache.set(cacheKey, result, TTL_SECONDS);

    return result;
  }
}
