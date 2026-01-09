import type { StockTransaction } from "../entities";
import type { StockTransactionType } from "../enums";

export interface ListStockTransactionsOptions {
  tenantId: string;
  page: number;
  limit: number;
  warehouseId?: string;
  inventoryItemId?: string;
  type?: StockTransactionType;
  startDate?: Date;
  endDate?: Date;
}

export interface IStockTransactionRepository {
  create: (transaction: StockTransaction) => Promise<StockTransaction>;
  findById: (id: string, tenantId: string) => Promise<StockTransaction | null>;
  findByReference: (referenceId: string, tenantId: string) => Promise<StockTransaction[]>;
  list: (options: ListStockTransactionsOptions) => Promise<{ items: StockTransaction[]; total: number }>;
}
