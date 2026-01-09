import type { StockTransaction } from "@/domain/entities";
import type { IStockTransactionRepository } from "@/domain/repositories";

import type { ListStockTransactionsDTO } from "./list-stock-transactions.dto";

export class ListStockTransactionsUseCase {
  constructor(
    private _transactionRepo: IStockTransactionRepository,
  ) {}

  async execute(dto: ListStockTransactionsDTO): Promise<{ items: StockTransaction[]; total: number }> {
    const result = await this._transactionRepo.list({
      tenantId: dto.tenantId,
      page: dto.page,
      limit: dto.limit,
      warehouseId: dto.warehouseId,
      inventoryItemId: dto.inventoryItemId,
      type: dto.type,
      startDate: dto.startDate,
      endDate: dto.endDate,
    });

    return result;
  }
}
