import type { StockResponseDTO } from "@/domain/dtos";
import type { IStockRepository } from "@/domain/repositories";

import type { GetWarehouseStockDTO } from "./get-warehouse-stock.dto";

export class GetWarehouseStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: GetWarehouseStockDTO): Promise<{
    data: StockResponseDTO[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { items, total } = await this._stockRepo.findByWarehouse(
      dto.warehouseId,
      dto.tenantId,
      { page: dto.page, limit: dto.limit },
    );

    const totalPages = Math.ceil(total / dto.limit);

    return {
      data: items,
      meta: {
        page: dto.page,
        limit: dto.limit,
        total,
        totalPages,
      },
    };
  }
}
