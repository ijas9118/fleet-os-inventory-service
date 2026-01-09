import type { StockTransaction } from "@/domain/entities";
import type { IStockTransactionRepository } from "@/domain/repositories";

import type { GetStockTransactionDTO } from "./get-stock-transaction.dto";

export class GetStockTransactionUseCase {
  constructor(
    private _transactionRepo: IStockTransactionRepository,
  ) {}

  async execute(dto: GetStockTransactionDTO): Promise<StockTransaction> {
    const transaction = await this._transactionRepo.findById(dto.id, dto.tenantId);

    if (!transaction) {
      throw new Error(`Stock transaction ${dto.id} not found`);
    }

    return transaction;
  }
}
