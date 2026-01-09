import type { Stock } from "@/domain/entities";
import type { IStockRepository } from "@/domain/repositories";

import type { ListStockDTO } from "./list-stock.dto";

export class ListStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: ListStockDTO): Promise<{ items: Stock[]; total: number }> {
    const result = await this._stockRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
    });

    return result;
  }
}
