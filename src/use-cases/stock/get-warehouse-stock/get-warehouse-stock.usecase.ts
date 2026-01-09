import type { Stock } from "@/domain/entities";
import type { IStockRepository } from "@/domain/repositories";

import type { GetWarehouseStockDTO } from "./get-warehouse-stock.dto";

export class GetWarehouseStockUseCase {
  constructor(
    private _stockRepo: IStockRepository,
  ) {}

  async execute(dto: GetWarehouseStockDTO): Promise<{ items: Stock[]; total: number }> {
    const result = await this._stockRepo.findByWarehouse(
      dto.warehouseId,
      dto.tenantId,
      { page: dto.page, limit: dto.limit },
    );

    return result;
  }
}
