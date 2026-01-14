import type { StockTransactionType } from "@/domain/enums";

export interface ListStockTransactionsDTO {
  tenantId: string;
  page: number;
  limit: number;
  warehouseId?: string;
  inventoryItemId?: string;
  type?: StockTransactionType;
  startDate?: Date;
  endDate?: Date;
}
