import type { StockResponseDTO } from "../dtos";
import type { Stock } from "../entities";

export interface ListStockOptions {
  tenantId: string;
  page: number;
  limit: number;
  warehouseId?: string;
  inventoryItemId?: string;
}

export interface IStockRepository {
  create: (stock: Stock) => Promise<Stock>;
  findById: (id: string, tenantId: string) => Promise<StockResponseDTO | null>;
  findByWarehouseAndItem: (
    warehouseId: string,
    inventoryItemId: string,
    tenantId: string,
  ) => Promise<Stock | null>;
  findByWarehouse: (
    warehouseId: string,
    tenantId: string,
    options: { page: number; limit: number },
  ) => Promise<{ items: StockResponseDTO[]; total: number }>;
  findByItem: (inventoryItemId: string, tenantId: string) => Promise<StockResponseDTO[]>;
  list: (options: ListStockOptions) => Promise<{ items: StockResponseDTO[]; total: number }>;
  update: (id: string, updates: Partial<Stock>) => Promise<void>;
}
