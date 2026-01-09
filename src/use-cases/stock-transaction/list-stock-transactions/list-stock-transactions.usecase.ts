import type { StockTransaction } from "@/domain/entities";
import type { IStockTransactionRepository } from "@/domain/repositories";

import type { ListStockTransactionsDTO } from "./list-stock-transactions.dto";

export class ListStockTransactionsUseCase {
  constructor(
    private _transactionRepo: IStockTransactionRepository,
  ) {}

  async execute(dto: ListStockTransactionsDTO): Promise<{
    data: StockTransaction[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const { items, total } = await this._transactionRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
      type: dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate,
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
