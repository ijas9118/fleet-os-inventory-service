import type { Stock } from "@/domain/entities";
import type { IStockRepository } from "@/domain/repositories";

import type { ListStockDTO } from "./list-stock.dto";

export class ListStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: ListStockDTO): Promise<{
    data: Stock[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { items, total } = await this._stockRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
    });

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
