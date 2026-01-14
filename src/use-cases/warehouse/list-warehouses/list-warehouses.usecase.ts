import type { IWareHouseRepository } from "@/domain/repositories";

import type { ListWarehousesParams, PaginatedWarehousesResponse } from "./list-warehouses.dto";

export class ListWarehousesUseCase {
  constructor(
    private _warehouseRepo: IWareHouseRepository,
  ) {}

  async execute(params: ListWarehousesParams): Promise<PaginatedWarehousesResponse> {
    const { warehouses, total } = await this._warehouseRepo.listWarehouses({
      tenantId: params.tenantId,
      page: params.page,
      limit: params.limit,
      search: params.search,
      status: params.status,
      includeArchived: params.includeArchived,
    });

    const totalPages = Math.ceil(total / params.limit);

    return {
      data: warehouses.map(w => ({
        id: w.id!,
        code: w.code,
        name: w.name,
        address: w.address,
        status: w.status,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
      })),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages,
      },
    };
  }
}
